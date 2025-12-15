import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage.js';
import { faker } from '@faker-js/faker';

test.describe('@runThis Alerts page', () => {
  let alerts;

  test.beforeEach(async ({ page }) => {
    alerts = new AlertsPage(page);
    await alerts.goto();
  });

  test('Simple alert should be accepted', async () => {
    await alerts.openSimpleAlert();
  });

  test('Timer alert should be accepted after delay', async () => {
    await alerts.openTimerAlert();
  });

  test('Confirm alert — accept', async () => {
    const result = await alerts.acceptConfirm();
    expect(result).toBe('You selected Ok');
  });

  test('Confirm alert — dismiss', async () => {
    const result = await alerts.dismissConfirm();
    expect(result).toBe('You selected Cancel');
  });

  test('Prompt alert — accept with text', async () => {
    const name = faker.person.firstName();
    const result = await alerts.acceptPrompt(name);
    expect(result).toContain(name);
  });

  test('Prompt alert — dismiss', async () => {
    const result = await alerts.dismissPrompt();
    expect(result === null || result === '').toBe(true);
  });


  test('Negative: should handle multiple rapid alerts', async () => {
    await test.step('Rapid alert clicking', async () => {
      alerts._handleDialog('accept');
      await alerts.safeClick(alerts.simpleAlertBtn);
      await alerts.safeClick(alerts.timerAlertBtn);
      await alerts.safeClick(alerts.confirmAlertBtn);
    });
  });
});
