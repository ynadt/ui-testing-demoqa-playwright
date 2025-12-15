import { BasePage } from './BasePage.js';

export class AlertsPage extends BasePage {
  constructor(page) {
    super(page);

    this.simpleAlertBtn = page.locator('#alertButton');
    this.timerAlertBtn = page.locator('#timerAlertButton');
    this.confirmAlertBtn = page.locator('#confirmButton');
    this.promptAlertBtn = page.locator('#promtButton');

    this.confirmResult = page.locator('#confirmResult');
    this.promptResult = page.locator('#promptResult');

    this._dialogHandled = false;
  }

  async goto() {
    await super.goto('/alerts');
  }

  async _handleDialog(action = 'accept', text = null) {
    if (this._dialogHandled) return;
    this._dialogHandled = true;

    return new Promise(resolve => {
      this.page.once('dialog', async dialog => {
        if (action === 'accept') {
          if (dialog.type() === 'prompt' && text !== null) {
            await dialog.accept(text);
          } else {
            await dialog.accept();
          }
        } else {
          await dialog.dismiss();
        }
        resolve();

        setTimeout(() => { this._dialogHandled = false; }, 100);
      });
    });
  }

  async openSimpleAlert() {
    const dialogPromise = this._handleDialog('accept');
    await this.safeClick(this.simpleAlertBtn, 'Simple Alert');
    await dialogPromise;
  }

  async openTimerAlert() {
    const dialogPromise = this._handleDialog('accept');
    await this.safeClick(this.timerAlertBtn, 'Timer Alert');
    await dialogPromise;
  }

  async acceptConfirm() {
    const dialogPromise = this._handleDialog('accept');
    await this.safeClick(this.confirmAlertBtn, 'Confirm Alert');
    await dialogPromise;

    await this.confirmResult.waitFor({ state: 'visible', timeout: 3000 });
    const result = (await this.confirmResult.textContent())?.trim();

    if (result && !result.includes('Ok')) {
      await this.page.waitForTimeout(200);
      const finalResult = (await this.confirmResult.textContent())?.trim();
      return finalResult;
    }

    return result;
  }

  async dismissConfirm() {
    const dialogPromise = this._handleDialog('dismiss');
    await this.safeClick(this.confirmAlertBtn, 'Confirm Alert');
    await dialogPromise;

    await this.confirmResult.waitFor({ state: 'visible', timeout: 3000 });
    return (await this.confirmResult.textContent())?.trim();
  }

  async acceptPrompt(text) {
    const dialogPromise = this._handleDialog('accept', text);
    await this.safeClick(this.promptAlertBtn, 'Prompt Alert');
    await dialogPromise;

    await this.promptResult.waitFor({ state: 'visible', timeout: 3000 });
    return (await this.promptResult.textContent())?.trim();
  }

  async dismissPrompt() {
    const dialogPromise = this._handleDialog('dismiss');
    await this.safeClick(this.promptAlertBtn, 'Prompt Alert');
    await dialogPromise;

    const exists = await this.promptResult.isVisible({ timeout: 2000 }).catch(() => false);
    return exists ? (await this.promptResult.textContent())?.trim() : null;
  }
}
