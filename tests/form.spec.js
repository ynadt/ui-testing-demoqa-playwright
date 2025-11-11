import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage.js';
import { faker } from '@faker-js/faker';

test.describe('@runThis Form page', () => {
  test.beforeEach(async ({ page }) => {
    const form = new FormPage(page);
    await form.goto();
  });

  test('should successfully submit form with valid data', async ({ page }) => {
    const form = new FormPage(page);
    const data = await form.fillFormWithRandomData();
    await form.submitForm();

    const modalData = await form.getModalTableData();

    expect(modalData['Student Name']).toBe(`${data.firstName} ${data.lastName}`);
    expect(modalData['Student Email']).toBe(data.email);
    expect(modalData['Mobile']).toBe(data.phone);
  });

  test('should submit form successfully with History subject', async ({ page }) => {
    const form = new FormPage(page);
    await form.fillFormWithRandomData('History');
    await form.submitForm();

    const modalData = await form.getModalTableData();
    expect(modalData['Subjects']).toContain('History');
  });

  test('should not submit form with empty first name', async ({ page }) => {
    const form = new FormPage(page);

    await form.fillBasicFields({
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      mobile: faker.string.numeric(10),
      gender: true
    });

    await form.submitForm();
    await expect(form.modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should not submit form with invalid email', async ({ page }) => {
    const form = new FormPage(page);

    await form.fillBasicFields({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.string.alphanumeric(10),
      mobile: faker.string.numeric(10),
      gender: true
    });

    await form.submitForm();
    await expect(form.modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should not submit form with short phone', async ({ page }) => {
    const form = new FormPage(page);

    await form.fillBasicFields({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      mobile: faker.string.numeric(5),
      gender: true
    });

    await form.submitForm();
    await expect(form.modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should not submit form without gender', async ({ page }) => {
    const form = new FormPage(page);

    await form.fillBasicFields({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      mobile: faker.string.numeric(10),
      gender: false
    });

    await form.submitForm();
    await expect(form.modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should upload image file', async ({ page }) => {
    const form = new FormPage(page);
    await form.fillFormWithRandomData();
    await form.submitForm();

    const modalData = await form.getModalTableData();
    expect(modalData['Picture']).toContain('test-image.png');
  });
});