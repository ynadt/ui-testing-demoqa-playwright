export const TIMEOUTS = {
  SHORT: 500,
  MEDIUM: 2000,
  LONG: 5000,
  PAGE_LOAD: 30000,
};

export class BasePage {
  constructor(page) {
    this.page = page;
    this._adsBlocked = false;
  }

  async goto(pathOrUrl = '') {
    if (!this._adsBlocked) {
      await this._blockAds();
      this._adsBlocked = true;
    }

    const target = pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `https://demoqa.com${pathOrUrl}`;

    await this.page.goto(target, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUTS.PAGE_LOAD,
    });

    await this.cleanPage();
  }

  async _blockAds() {
    await this.page.route('**/*', route => {
      const url = route.request().url();

      const blocked = [
        'googlesyndication.com',
        'doubleclick.net',
        'google-analytics.com',
        'googletagmanager.com',
        'adplus',
      ].some(pattern => url.includes(pattern));

      if (blocked) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  // ---------------- PAGE CLEANUP ----------------

  async cleanPage() {
    await this.page.evaluate(() => {
      document
        .querySelectorAll('#fixedban, iframe, footer, #adplus-anchor')
        .forEach(el => el.remove());

      document
        .querySelectorAll('.modal-backdrop')
        .forEach(el => el.remove());
    });
  }

  // ---------------- WAIT HELPERS ----------------

  async waitVisible(locator, timeout = TIMEOUTS.LONG) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitHidden(locator, timeout = TIMEOUTS.LONG) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async isVisibleNow(locator) {
    try {
      return await locator.isVisible({ timeout: TIMEOUTS.SHORT });
    } catch {
      return false;
    }
  }

  // ---------------- SAFE ACTIONS ----------------

  async closeModalIfPresent() {
    const modal = this.page.locator('.modal.show');

    if (await modal.isVisible({ timeout: 300 }).catch(() => false)) {
      await this.page.keyboard.press('Escape').catch(() => {});
      await modal.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    }
  }


  async safeClick(locator, label = '') {
    await this.closeModalIfPresent();
    await this.cleanPage();

    try {
      await locator.click({ timeout: TIMEOUTS.MEDIUM });
    } catch (error) {
      console.warn(`Retry click${label ? ` (${label})` : ''}: ${error.message}`);

      await locator.scrollIntoViewIfNeeded();
      const handle = await locator.elementHandle();
      if (!handle) throw error;

      await this.page.evaluate(el => el.click(), handle);
    }
  }


  async safeFill(locator, value, label = '') {
    if (value === undefined || value === null) return;

    await this.cleanPage();

    try {
      await locator.fill(value);
    } catch (error) {
      console.warn(`Retry fill${label ? ` (${label})` : ''}: ${error.message}`);
      await locator.click();
      await locator.fill(value);
    }
  }

  async selectFromAutocomplete(inputLocator, value) {
    await this.safeClick(inputLocator, 'autocomplete');
    await this.safeFill(inputLocator, value);
    await this.page.keyboard.press('Enter');
  }


  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}