import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

import { getHighlightedCode } from './shiki';

async function insertBlock(page: Page, query: string) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type(`/${query}`);

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  return { textbox };
}

test('resizes a spacer from its bubble menu', async ({ page }) => {
  const { textbox } = await insertBlock(page, 'spac');

  await textbox.locator('[data-mly-spacer-view]').click();

  const height = page.getByLabel('Height', { exact: true });
  await expect(height).toBeVisible();

  await height.fill('64');
  await height.press('Enter');

  await expect(textbox.locator('[data-mly-spacer-view]')).toHaveCSS(
    'height',
    '64px'
  );
});

test('makes a button full width from its bubble menu', async ({ page }) => {
  const { textbox } = await insertBlock(page, 'butt');

  await textbox.locator('[data-node-type="button"]').click();

  const fullWidth = page.getByRole('button', { name: 'Full Width' });
  await expect(fullWidth).toBeVisible();
  await fullWidth.click();

  await expect(page.getByRole('button', { name: 'Tight' })).toBeVisible();

  const button = textbox.locator('[data-node-type="button"]');
  const paragraph = textbox.locator('p').first();

  expect((await button.boundingBox())!.width).toBeCloseTo(
    (await paragraph.boundingBox())!.width,
    0
  );
});

test('centres a section from its bubble menu', async ({ page }) => {
  const { textbox } = await insertBlock(page, 'sect');

  await textbox.locator('[data-node-type="section"] p').click();

  const menu = page.locator('[data-mly-bubble-menu]');
  await menu.getByRole('button', { name: 'Alignment' }).click();
  await page.getByRole('button', { name: 'Align Center' }).click();

  await expect(textbox.locator('[data-node-type="section"]')).toHaveCSS(
    'text-align',
    'center'
  );
});

test('changes the columns gap from its bubble menu', async ({ page }) => {
  await insertBlock(page, 'colu');

  const gap = page.getByLabel('Gap', { exact: true });
  await expect(gap).toBeVisible();

  await gap.fill('32');
  await gap.press('Enter');

  await expect(
    page.getByRole('textbox').first().locator('[data-node-type="columns"]')
  ).toHaveCSS('column-gap', '32px');
});

test('adds a third column from its bubble menu', async ({ page }) => {
  await insertBlock(page, 'colu');

  await page.getByRole('button', { name: 'Column Settings' }).click();
  await page.getByRole('button', { name: '3 Columns' }).click();

  const middle = page.getByLabel('Middle Column Width');
  await expect(middle).toBeVisible();
  await expect(middle).toHaveValue('auto');

  await expect(
    page.getByRole('textbox').first().locator('[data-node-type="column"]')
  ).toHaveCount(3);
});

test('sets a column width from its bubble menu', async ({ page }) => {
  await insertBlock(page, 'colu');

  await page.getByRole('button', { name: 'Column Settings' }).click();

  const left = page.getByLabel('Left Column Width');
  await expect(left).toBeVisible();

  await left.fill('40');
  await left.press('Enter');

  const columns = page
    .getByRole('textbox')
    .first()
    .locator('[data-node-type="columns"]');
  const firstColumn = columns.locator('[data-node-type="column"]').first();

  await expect(firstColumn).toHaveAttribute('style', /width:\s*40%/);

  expect((await firstColumn.boundingBox())!.width).toBeCloseTo(
    (await columns.boundingBox())!.width * 0.4,
    0
  );
});

test('renders a tight button centred in the editor', async ({ page }) => {
  const { textbox } = await insertBlock(page, 'butt');

  const button = textbox.locator('[data-node-type="button"]');
  await expect(button).toBeVisible();

  const paragraph = textbox.locator('p').first();
  const before = await button.boundingBox();
  const row = await paragraph.boundingBox();

  expect(before!.width).toBeLessThan(row!.width);
  expect(before!.x - row!.x).toBeCloseTo(
    row!.x + row!.width - (before!.x + before!.width),
    0
  );

  await button.click();
  await page.getByRole('button', { name: 'Full Width' }).click();

  const after = await button.boundingBox();
  expect(after!.width).toBeCloseTo(row!.width, 0);
});

test('carries a button padding edit into the exported email', async ({
  page,
}) => {
  const { textbox } = await insertBlock(page, 'butt');

  const button = textbox.locator('[data-node-type="button"]');
  await button.click();

  await page.getByRole('button', { name: 'Button Style' }).click();

  const padding = page.getByLabel('Padding', { exact: true });
  await expect(padding).toBeVisible();
  await padding.fill('24');
  await padding.press('Enter');

  await expect(button).toHaveAttribute('style', /padding:\s*24px/);

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'HTML', exact: true }).click();

  await expect(await getHighlightedCode(page)).toContainText(/padding:24px/);
});
