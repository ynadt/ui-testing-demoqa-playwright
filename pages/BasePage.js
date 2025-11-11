export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(pathOrUrl = '') {
    const target = pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `https://demoqa.com${pathOrUrl}`;
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
    await this.cleanPage();
  }

  async cleanPage() {
    await this.page.evaluate(() => {
      const ads = document.querySelectorAll('#fixedban, iframe, footer, #adplus-anchor');
      ads.forEach(ad => ad.remove());

      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        const isResultModal = modal.querySelector('#example-modal-sizes-title-lg');
        if (!isResultModal) {
          modal.style.display = 'none';
          modal.style.visibility = 'hidden';
        }
      });

      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
        backdrop.style.display = 'none';
        backdrop.style.visibility = 'hidden';
      });
    });
  }

  async forceClick(locator, buttonName = '') {
    await this.cleanPage();

    try {
      await locator.click({ timeout: 3000 });
    } catch (e) {
      console.warn(`Force clicking ${buttonName} via JavaScript`);
      await locator.scrollIntoViewIfNeeded();

      await this.page.evaluate((element) => {
        if (element) element.click();
      }, await locator.elementHandle());
    }
  }

  async safeFill(locator, value, fieldName = '') {
    await this.cleanPage();
    await locator.fill(value);
  }

  async selectFromDropdown(dropdownLocator, inputLocator, value) {
    await this.forceClick(dropdownLocator, `Dropdown ${value}`);
    await this.safeFill(inputLocator, value);
    await this.page.keyboard.press('Enter');
  }
}