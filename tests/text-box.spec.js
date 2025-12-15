import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/TextBoxPage.js';
import { faker } from '@faker-js/faker';

test.describe('@runThis Text Box page', () => {
  let textBox;

  test.beforeEach(async ({ page }) => {
    textBox = new TextBoxPage(page);
    await textBox.goto();
  });

  test('Should fill text box with random data and show result', async () => {
    const data = await textBox.fillWithRandomData();
    await textBox.submitForm();

    const output = await textBox.getOutputData();

    expect(output.name).toBe(data.fullName);
    expect(output.email).toBe(data.email);
    expect(output.currentAddress).toBe(data.currentAddress);
    expect(output.permanentAddress).toBe(data.permanentAddress);
  });


  const dataSets = [
    {
      name: 'standard data',
      data: {
        fullName: 'John Doe',
        email: 'john.doe@test.com',
        currentAddress: 'Street 1',
        permanentAddress: 'Street 2',
      },
    },
    {
      name: 'special characters',
      data: {
        fullName: 'Anna-Мария O\'Connor',
        email: 'anna@test.com',
        currentAddress: 'Calle #123',
        permanentAddress: 'Av. São João',
      },
    },
    {
      name: 'numbers in name',
      data: {
        fullName: 'User123',
        email: 'user123@test.com',
        currentAddress: 'Building 5',
        permanentAddress: 'Block 9',
      },
    },
  ];

  for (const set of dataSets) {
    test(`Should submit text box with ${set.name}`, async () => {
      await textBox.fillForm(set.data);
      await textBox.submitForm();

      const output = await textBox.getOutputData();

      expect(output.name).toBe(set.data.fullName);
      expect(output.email).toBe(set.data.email);
      expect(output.currentAddress).toBe(set.data.currentAddress);
      expect(output.permanentAddress).toBe(set.data.permanentAddress);
    });
  }


  test('Negative: should show validation error for invalid email', async () => {
    await textBox.fillForm({
      fullName: faker.person.fullName(),
      email: 'invalid-email',
    });

    await textBox.submitForm();

    const validationMessage = await textBox.getEmailValidationMessage();
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('Negative: should show validation error for empty email', async () => {
    await textBox.fillForm({
      fullName: faker.person.fullName(),
      email: '',
    });

    await textBox.submitForm();

    const validationMessage = await textBox.getEmailValidationMessage();
    expect(validationMessage.length).toEqual(0);
  });

  test('Negative: should show validation error for missing name', async () => {
    await textBox.fillForm({
      fullName: '',
      email: faker.internet.email(),
    });

    await textBox.submitForm();

    const validationMessage = await textBox.getEmailValidationMessage();
    expect(validationMessage.length).toEqual(0);
  });


  test('Edge case: should submit text box with edge case data (special chars in address)', async () => {
    const edgeCaseData = {
      fullName: 'John Doe',
      email: 'john.doe@test.com',
      currentAddress: 'Calle #123',
      permanentAddress: 'Av. São João',
    };

    await textBox.fillForm(edgeCaseData);
    await textBox.submitForm();

    const output = await textBox.getOutputData();
    expect(output.name).toBe(edgeCaseData.fullName);
    expect(output.email).toBe(edgeCaseData.email);
    expect(output.currentAddress).toBe(edgeCaseData.currentAddress);
    expect(output.permanentAddress).toBe(edgeCaseData.permanentAddress);
  });

});
