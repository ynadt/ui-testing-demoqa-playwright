import { BasePage, TIMEOUTS } from './BasePage.js';

export class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);

    this.urlPath = '/select-menu';

    this.selectValue = this.page.locator('#withOptGroup');
    this.selectOne = this.page.locator('#selectOne');
    this.oldStyleSelectSelector = '#oldSelectMenu';
    this.oldStyleSelect = this.page.locator(this.oldStyleSelectSelector);

    this.carsSelect = this.page.locator('#cars');

    this.colorMultiSelectContainer = this.page.locator('#selectMenuContainer > div').nth(6);

    this.reactOptions = this.page.locator('div[id*="react-select"][id*="-option"]');
  }

  async goto() {
    await super.goto(this.urlPath);
  }

  async _hideOverlaysBeforeOpen() {
    await this.page.mouse.move(0, 0);
    await this.reactOptions.first().waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT }).catch(() => {});
  }

  async _openColorReactSelect() {
    await this._hideOverlaysBeforeOpen();

    await this.colorMultiSelectContainer.scrollIntoViewIfNeeded();

    const control = this.colorMultiSelectContainer.locator('[class*="control"]').first();
    const input = this.colorMultiSelectContainer.locator('input[id*="react-select"]').first();

    await control.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

    const alreadyOpen = await this.reactOptions.first().isVisible({ timeout: 200 }).catch(() => false);
    if (alreadyOpen) return;

    const inputVisible = await input.isVisible({ timeout: 200 }).catch(() => false);
    if (inputVisible) {
      await input.click({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    } else {
      await control.click({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    }

    const opened = await this.reactOptions.first().isVisible({ timeout: 600 }).catch(() => false);
    if (!opened) {
      await control.click({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    }

    await this.reactOptions.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  async selectColorMulti(colorLabel) {
    await this._openColorReactSelect();

    const option = this.page
      .locator('div[id*="react-select"][id*="-option"]')
      .filter({ hasText: colorLabel })
      .first();

    await option.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await option.click();

    await this.reactOptions.first().waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
  }

  async selectMultiColors(colorLabels) {
    for (const label of colorLabels) {
      await this.selectColorMulti(label);
    }
  }

  async getSelectedColorLabels() {
    try {
      const colorMultiSelectContainer = this.page.locator('#selectMenuContainer > div').nth(6);
      const colorMultiSelectText = await colorMultiSelectContainer.evaluate(el => {
        const multiValueItems = Array.from(el.querySelectorAll('[class*="multiValue"]'));
        if (multiValueItems.length > 0) {
          const values = multiValueItems.map(item => {
            const label = item.querySelector('[class*="multiValueLabel"]') || item;
            const text = label.textContent || '';
            return text.trim();
          }).filter(text => text && text.length > 0);

          if (values.length > 0) {
            return values;
          }
        }

        const control = el.querySelector('[class*="control"]');
        if (control) {
          const valueContainer = control.querySelector('[class*="ValueContainer"]') ||
            control.querySelector('[class*="valueContainer"]') ||
            control;

          if (valueContainer) {
            const visibleValues = Array.from(valueContainer.querySelectorAll('[class*="multiValue"]'))
              .filter(item => {
                const style = window.getComputedStyle(item);
                return style.display !== 'none' && style.visibility !== 'hidden';
              })
              .map(item => {
                const text = item.textContent || '';
                return text.trim();
              })
              .filter(text => text && text.length > 0);

            if (visibleValues.length > 0) {
              return visibleValues;
            }
          }
        }

        return [];
      });
      return colorMultiSelectText || [];
    } catch {
      return [];
    }
  }


  async selectValueGroup2Option1() {
    await this.safeClick(this.selectValue, 'Select Value');
    const option = this.page
      .locator('div[id*="react-select"][id*="-option"]')
      .filter({ hasText: 'Group 2, option 1' })
      .first();

    await option.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await option.click();
  }

  async selectOneOther() {
    await this.safeClick(this.selectOne, 'Select One');
    const option = this.page
      .locator('div[id*="react-select"][id*="-option"]')
      .filter({ hasText: 'Other' })
      .first();

    await option.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await option.click();
  }

  async selectOldStyleGreen() {
    await this.page.selectOption(this.oldStyleSelectSelector, { label: 'Green' });
  }

  async selectCars(values) {
    await this.page.selectOption('#cars', values);
  }


  async getOldStyleSelectedLabel() {
    return await this.oldStyleSelect.evaluate(select => select.options[select.selectedIndex].text.trim());
  }

  async getSelectValueText() {
    return (await this.selectValue.textContent())?.trim() || '';
  }

  async getSelectOneText() {
    return (await this.selectOne.textContent())?.trim() || '';
  }

  async getSelections() {
    return {
      selectValue: await this.getSelectValueText(),
      selectOne: await this.getSelectOneText(),
      oldStyle: await this.getOldStyleSelectedLabel(),
      multiColors: await this.getSelectedColorLabels(),
    };
  }
}
