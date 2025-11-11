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
  }

  async goto() {
    await super.goto('/alerts');
  }

  async clickSimpleAlert() {
    await this.forceClick(this.simpleAlertBtn, 'Simple Alert');
  }

  async clickTimerAlert() {
    await this.forceClick(this.timerAlertBtn, 'Timer Alert');
  }

  async clickConfirmAlert() {
    await this.forceClick(this.confirmAlertBtn, 'Confirm Alert');
  }

  async clickPromptAlert() {
    await this.forceClick(this.promptAlertBtn, 'Prompt Alert');
  }
}