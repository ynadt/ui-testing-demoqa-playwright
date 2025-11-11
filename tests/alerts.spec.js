import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage.js';
import { faker } from '@faker-js/faker';

test.describe('@runThis Alerts page', () => {
  let alertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    await alertsPage.goto();
  });

  test('should handle simple alert', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('You clicked a button');
      await dialog.accept();
    });

    await alertsPage.clickSimpleAlert();
  });

  test('should handle timer alert after 5 seconds', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('This alert appeared after 5 seconds');
      await dialog.accept();
    });

    await alertsPage.clickTimerAlert();
  });

  test.describe('Confirm box', () => {
    test('should handle confirm box with accept', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Do you confirm action?');
        await dialog.accept();
      });

      await alertsPage.clickConfirmAlert();
      await expect(alertsPage.confirmResult).toHaveText('You selected Ok');
    });

    test('should handle confirm box with dismiss', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Do you confirm action?');
        await dialog.dismiss();
      });

      await alertsPage.clickConfirmAlert();
      await expect(alertsPage.confirmResult).toHaveText('You selected Cancel');
    });
  });

  test('should handle prompt box with random input', async ({ page }) => {
    const randomName = faker.person.firstName();

    page.once('dialog', async dialog => {
      await dialog.accept(randomName);
    });

    await alertsPage.clickPromptAlert();
    await expect(alertsPage.promptResult).toContainText(`You entered ${randomName}`);
  });
});