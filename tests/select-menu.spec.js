import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../pages/SelectMenuPage.js';

test.describe('@runThis Select Menu page', () => {
  let menu;

  test.beforeEach(async ({ page }) => {
    menu = new SelectMenuPage(page);
    await menu.goto();
  });

  test('Should select required options in all dropdowns', async () => {
    await menu.selectValueGroup2Option1();
    await menu.selectOneOther();
    await menu.selectOldStyleGreen();
    await menu.selectMultiColors(['Black', 'Blue']);

    const selections = await menu.getSelections();

    expect(selections.selectValue).toContain('Group 2');
    expect(selections.selectValue).toContain('option 1');
    expect(selections.selectOne).toContain('Other');
    expect(selections.oldStyle).toBe('Green');
    expect(selections.multiColors).toEqual(expect.arrayContaining(['Black', 'Blue']));
  });


  const colorCases = [
    { title: 'Black', colors: ['Black'] },
    { title: 'Blue', colors: ['Blue'] },
    { title: 'Black and Blue', colors: ['Black', 'Blue'] },
  ];

  for (const tc of colorCases) {
    test(`Parameterized: Color multiselect should accept: ${tc.title}`, async () => {
      await menu.selectMultiColors(tc.colors);
      const selected = await menu.getSelectedColorLabels();

      for (const c of tc.colors) {
        expect(selected).toContain(c);
      }
    });
  }

  test('Negative: Should not add non-existing color', async () => {
    const before = await menu.getSelectedColorLabels();

    await menu._openColorReactSelect();
    const nonexistent = menu.page
      .locator('div[id*="react-select"][id*="-option"]')
      .filter({ hasText: 'NotAColor' })
      .first();

    await expect(nonexistent).toHaveCount(0);

    await menu.page.keyboard.press('Escape').catch(() => {});
    const after = await menu.getSelectedColorLabels();

    expect(after).toEqual(before);
  });

});

