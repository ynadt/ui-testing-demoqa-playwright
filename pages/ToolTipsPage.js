import { BasePage } from './BasePage.js';
import { TIMEOUTS } from './BasePage.js';

export class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);

    this.button = page.locator('#toolTipButton');
    this.textField = page.locator('#toolTipTextField');

    this.contraryLink = page.locator(
      '#texToolTopContainer a', { hasText: 'Contrary' }
    );
    this.versionLink = page.getByRole('link', { name: '1.10.32' });

    this.tooltip = page.locator('.tooltip-inner');
  }

  async goto() {
    await super.goto('/tool-tips');
  }

  async _hoverAndGetTooltip(target) {
    await this.page.mouse.move(0, 0);
    await target.scrollIntoViewIfNeeded();
    await target.hover();

    await this.tooltip.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.MEDIUM,
    });

    const text = await this.tooltip.textContent();
    return text?.trim() ?? '';
  }


  async getButtonTooltip() {
    return this._hoverAndGetTooltip(this.button);
  }

  async getTextFieldTooltip() {
    return this._hoverAndGetTooltip(this.textField);
  }

  async getContraryLinkTooltip() {
    return this._hoverAndGetTooltip(this.contraryLink);
  }

  async getVersionLinkTooltip() {
    return this._hoverAndGetTooltip(this.versionLink);
  }
}
