import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage.js';
import { faker } from '@faker-js/faker';

test.describe('@runThis Form page', () => {
  let form;

  test.beforeEach(async ({ page }) => {
    form = new FormPage(page);
    await form.goto();
  });

  test('Should successfully submit form with valid random data', async () => {
    const data = await form.fillFormWithRandomData();
    await form.submitForm();

    const modalData = await form.getModalTableData();

    expect(modalData['Student Name']).toBe(
      `${data.firstName} ${data.lastName}`
    );
    expect(modalData['Student Email']).toBe(data.email);
    expect(modalData['Mobile']).toBe(data.phone);
    expect(modalData['Subjects']).toContain(data.subject);
    expect(modalData['Picture']).toContain('test-image.png');
  });


  const subjects = ['Maths', 'History', 'English'];

  for (const subject of subjects) {
    test(`Parameterized: should submit form successfully with subject: ${subject}`, async () => {
      const data = await form.fillFormWithRandomData(subject);
      await form.submitForm();

      const modalData = await form.getModalTableData();
      expect(modalData['Subjects']).toContain(subject);
    });
  }


  const negativeCases = [
    { name: 'missing first name', data: { lastName: faker.person.lastName(), email: faker.internet.email(), mobile: faker.string.numeric(10), gender: true } },
    { name: 'invalid email', data: { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: 'invalid-email', mobile: faker.string.numeric(10), gender: true } },
    { name: 'short phone number', data: { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email(), mobile: faker.string.numeric(5), gender: true } },
    { name: 'missing gender', data: { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email(), mobile: faker.string.numeric(10), gender: false } },
  ];

  for (const testCase of negativeCases) {
    test(`Negative: should not submit form when ${testCase.name}`, async () => {
      await form.fillBasicFields(testCase.data);
      await form.submitForm();

      await expect(form.modal).not.toBeVisible({ timeout: 3000 });
    });
  }

  test('Should upload image file correctly', async () => {
    await form.fillFormWithRandomData();
    await form.submitForm();

    const modalData = await form.getModalTableData();
    expect(modalData['Picture']).toContain('test-image.png');
  });
});
