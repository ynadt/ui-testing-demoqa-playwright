import { BasePage } from './BasePage.js';
import { faker } from '@faker-js/faker';
import path from 'path';

export class FormPage extends BasePage {
  constructor(page) {
    super(page);

    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.genderFemale = page.locator('//label[@for="gender-radio-2"]');
    this.mobile = page.locator('#userNumber');
    this.subjects = page.locator('//input[@id="subjectsInput"]');
    this.hobbySports = page.locator('//label[text()="Sports"]');
    this.pictureUpload = page.locator('#uploadPicture');
    this.address = page.locator('#currentAddress');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.submitBtn = page.locator('#submit');
    this.modal = page.locator('.modal-content');
  }

  async goto() {
    await super.goto('/automation-practice-form');
  }

  async selectReactOption(containerLocator, value, label = '') {
    await this.closeModalIfPresent();
    await this.safeClick(containerLocator, label);
    await this.page.keyboard.type(value);
    await this.page.keyboard.press('Enter');
  }

  async selectStateAndCity(state, city) {
    await this.selectReactOption(this.state, state, 'State');
    await this.selectReactOption(this.city, city, 'City');
  }

  async fillFormWithRandomData(subject = 'Maths') {
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.string.numeric(10),
      subject,
      address: faker.location.streetAddress(),
      filePath: path.resolve('tests/data/test-image.png'),
    };

    await this.safeFill(this.firstName, data.firstName);
    await this.safeFill(this.lastName, data.lastName);
    await this.safeFill(this.email, data.email);
    await this.safeClick(this.genderFemale, 'Gender');
    await this.safeFill(this.mobile, data.phone);

    await this.safeClick(this.subjects, 'Subjects');
    await this.page.keyboard.type(data.subject, { delay: 50 });
    await this.page
      .locator('.subjects-auto-complete__option')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 });
    await this.page.keyboard.press('Enter');

    await this.safeClick(this.hobbySports, 'Sports hobby');
    await this.pictureUpload.setInputFiles(data.filePath);
    await this.safeFill(this.address, data.address);

    await this.selectStateAndCity('NCR', 'Delhi');

    return data;
  }

  async fillBasicFields(fields) {
    if (fields.firstName) await this.safeFill(this.firstName, fields.firstName);
    if (fields.lastName) await this.safeFill(this.lastName, fields.lastName);
    if (fields.email) await this.safeFill(this.email, fields.email);
    if (fields.mobile) await this.safeFill(this.mobile, fields.mobile);
    if (fields.gender) await this.safeClick(this.genderFemale, 'Gender');
  }

  async submitForm() {
    await this.closeModalIfPresent();
    await this.safeClick(this.submitBtn, 'Submit');
  }

  async getModalTableData() {
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });

    const rows = this.page.locator('.modal-body table tbody tr');
    const result = {};
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const key = (await row.locator('td').first().textContent()).trim();
      const value = (await row.locator('td').last().textContent()).trim();
      result[key] = value;
    }

    return result;
  }
}
