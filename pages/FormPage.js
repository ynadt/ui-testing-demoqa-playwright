import { BasePage } from './BasePage.js';
import { faker } from '@faker-js/faker';
import path from 'path';

export class FormPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    //TODO:  This selector is based on a CSS style class, which can change frequently and break your tests.
    //  Prefer using more stable attributes such as data-testid, aria-label, or unique element identifiers for better maintainability.
    this.genderFemale = page.locator('label[for="gender-radio-2"]');
    this.mobile = page.locator('#userNumber');
    this.subjects = page.locator('#subjectsInput');
    this.hobbySports = page.locator('label[for="hobbies-checkbox-1"]');
    this.pictureUpload = page.locator('#uploadPicture');
    this.address = page.locator('#currentAddress');
    this.state = page.locator('#state');
    this.stateInput = page.locator('#react-select-3-input');
    this.city = page.locator('#city');
    this.cityInput = page.locator('#react-select-4-input');
    this.submitBtn = page.locator('#submit');
    this.modal = page.locator('.modal-content');
  }

  async goto() {
    await super.goto('/automation-practice-form');
  }

  async fillFormWithRandomData(subject = 'Maths') {
    const randomData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.string.numeric(10),
      subject,
      address: faker.location.streetAddress(),
      filePath: path.resolve('tests/data/test-image.png')
    };

    await this.safeFill(this.firstName, randomData.firstName);
    await this.safeFill(this.lastName, randomData.lastName);
    await this.safeFill(this.email, randomData.email);
    await this.forceClick(this.genderFemale, 'Gender');
    await this.safeFill(this.mobile, randomData.phone);

    await this.safeFill(this.subjects, randomData.subject);
    await this.page.keyboard.press('Enter');

    await this.forceClick(this.hobbySports, 'Sports Hobby');
    await this.pictureUpload.setInputFiles(randomData.filePath);
    await this.safeFill(this.address, randomData.address);

    await this.selectFromDropdown(this.state, this.stateInput, 'NCR');
    await this.selectFromDropdown(this.city, this.cityInput, 'Delhi');

    return randomData;
  }

  async submitForm() {
    await this.forceClick(this.submitBtn, 'Submit');
  }

  async getModalTableData() {
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
//TODO remove all locators to the constructors
    const tableRows = this.page.locator('.modal-body table tbody tr');
    const rowCount = await tableRows.count();

    const modalData = {};
    for (let i = 0; i < rowCount; i++) {
      const row = tableRows.nth(i);
      const label = await row.locator('td').first().textContent();
      const value = await row.locator('td').last().textContent();
      modalData[label.trim()] = value.trim();
    }

    return modalData;
  }

  async fillBasicFields(fields) {
    if (fields.firstName) await this.safeFill(this.firstName, fields.firstName);
    if (fields.lastName) await this.safeFill(this.lastName, fields.lastName);
    if (fields.email) await this.safeFill(this.email, fields.email);
    if (fields.mobile) await this.safeFill(this.mobile, fields.mobile);
    if (fields.gender) await this.forceClick(this.genderFemale, 'Gender');
  }
}
