import { test, expect } from '@playwright/test';
import { ToolTipsPage } from '../pages/ToolTipsPage.js';

test.describe('@runThis ToolTips page', () => {
  let tooltips;

  test.beforeEach(async ({ page }) => {
    tooltips = new ToolTipsPage(page);
    await tooltips.goto();
  });

  test('Tooltip for Button should display correct text', async () => {
    const text = await tooltips.getButtonTooltip();
    expect(text).toBe('You hovered over the Button');
  });

  test('Tooltip for Text Field should display correct text', async () => {
    const text = await tooltips.getTextFieldTooltip();
    expect(text).toBe('You hovered over the text field');
  });

  test('Tooltip for Contrary Link should display correct text', async () => {
    const text = await tooltips.getContraryLinkTooltip();
    expect(text).toBe('You hovered over the Contrary');
  });

  test('Tooltip for Version Link should display correct text', async () => {
    const text = await tooltips.getVersionLinkTooltip();
    expect(text).toBe('You hovered over the 1.10.32');
  });


  const tooltipCases = [
    {
      name: 'Button',
      action: p => p.getButtonTooltip(),
      expected: 'You hovered over the Button',
    },
    {
      name: 'Text Field',
      action: p => p.getTextFieldTooltip(),
      expected: 'You hovered over the text field',
    },
    {
      name: 'Contrary Link',
      action: p => p.getContraryLinkTooltip(),
      expected: 'You hovered over the Contrary',
    },
    {
      name: 'Version Link',
      action: p => p.getVersionLinkTooltip(),
      expected: 'You hovered over the 1.10.32',
    },
  ];

  for (const tc of tooltipCases) {
    test(
      `Parameterized: tooltip for ${tc.name} should display correct text`,
      async () => {
        const text = await tc.action(tooltips);
        expect(text).toBe(tc.expected);
      }
    );
  }
});
