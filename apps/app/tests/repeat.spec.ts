import type { Locator, Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

async function getSettledBox(locator: Locator) {
  let previous: string | null = null;

  await expect
    .poll(async () => {
      const current = JSON.stringify(await locator.boundingBox());
      const settled = current === previous;
      previous = current;

      return settled;
    })
    .toBe(true);

  return locator.boundingBox();
}

async function insertRepeat(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('/repeat');

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  const repeat = textbox.locator('[data-node-type="repeat"]');

  return { popover, repeat };
}

test('picks the repeat list from the variable suggestion', async ({ page }) => {
  const { popover, repeat } = await insertRepeat(page);
  await repeat.locator('p').click();

  const field = page.locator(
    '[data-mly-variable-only-editor] [contenteditable="true"]'
  );
  await field.click();
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('people');

  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');

  await expect(field.locator('[data-node-type="variable"]')).toContainText(
    'people'
  );
});

test('keeps the repeat bubble menu anchored to the block', async ({ page }) => {
  const { repeat } = await insertRepeat(page);
  await repeat.locator('p').click();
  await page.keyboard.type('First line');

  const menu = page.locator('[data-mly-floating-element="repeat-bubble-menu"]');
  await expect(menu).toBeVisible();
  const before = await getSettledBox(menu);

  await page.keyboard.press('Enter');
  await page.keyboard.type('A much longer second line of content');

  const after = await getSettledBox(menu);

  expect(Math.abs(after!.x - before!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(after!.y - before!.y)).toBeLessThanOrEqual(1);
});

test('inserts a repeat and renders one copy per item', async ({ page }) => {
  const { popover, repeat } = await insertRepeat(page);
  await repeat.locator('p').click();
  await page.keyboard.type('Hello ');
  await page.keyboard.type('{{');
  await expect(popover).toBeVisible();
  await page.keyboard.type('name');
  await page.keyboard.press('Enter');

  await expect(page.locator('[data-mly-variable-only-editor]')).toContainText(
    'items'
  );

  const preview = page.frameLocator('iframe').first().locator('body');
  await expect(preview).toContainText('Ada Lovelace');
  await expect(preview).toContainText('Grace Hopper');
});
