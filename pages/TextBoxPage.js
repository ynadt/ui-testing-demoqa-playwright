import { BasePage } from './BasePage.js';
import { faker } from '@faker-js/faker';
import { normalizeLabeledText } from '../utils/textUtils.js';

export class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);

    this.fullNameInput = page.getByPlaceholder('Full Name');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.getByRole('textbox', { name: 'Current Address' });
    this.permanentAddressInput = page.locator('#permanentAddress');

    this.submitButton = page.getByRole('button', { name: 'Submit' });

    this.output = page.locator('#output');
    this.outputName = page.locator('#name');
    this.outputEmail = page.locator('#email');
    this.outputCurrentAddress = page.locator('#currentAddress', { hasText: 'Address' });
    this.outputPermanentAddress = page.locator('#permanentAddress', { hasText: 'Address' });
  }

  async goto() {
    await super.goto('/text-box');
  }

  async fillForm(data = {}) {
    await this.safeFill(this.fullNameInput, data.fullName);
    await this.safeFill(this.emailInput, data.email);
    await this.safeFill(this.currentAddressInput, data.currentAddress);
    await this.safeFill(this.permanentAddressInput, data.permanentAddress);
  }

  async fillWithRandomData() {
    const data = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      currentAddress: faker.location.streetAddress(),
      permanentAddress: faker.location.streetAddress(),
    };

    await this.fillForm(data);
    return data;
  }

  async submitForm() {
    await this.safeClick(this.submitButton);
  }

  async getOutputData() {
    const visible = await this.output.isVisible().catch(() => false);
    if (!visible) {
      return {
        name: '',
        email: '',
        currentAddress: '',
        permanentAddress: '',
      };
    }

    return {
      name: normalizeLabeledText(await this.outputName.textContent(), 'Name'),
      email: normalizeLabeledText(await this.outputEmail.textContent(), 'Email'),
      currentAddress: normalizeLabeledText(
        await this.outputCurrentAddress.textContent(),
        'Current Address'
      ),
      permanentAddress: normalizeLabeledText(
        await this.outputPermanentAddress.textContent(),
        'Permanent Address|Permananet Address'
      ),
    };
  }

  async getEmailValidationMessage() {
    return await this.emailInput.evaluate(el => el.validationMessage);
  }
}
