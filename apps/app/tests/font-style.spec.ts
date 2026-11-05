import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

import { getHighlightedCode } from './shiki';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

async function openFontStylePanel(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await menu.getByRole('button', { name: 'Font Style' }).click();

  const panel = page.locator('[data-mly-font-style-config]');
  await expect(panel).toBeVisible();

  return { panel, textbox };
}

async function pickFrom(page: Page, label: string, option: string) {
  await page
    .locator(`[data-mly-select-trigger][aria-label="${label}"]`)
    .click();
  await page
    .locator('[data-mly-select-content][data-open] [data-mly-select-item]', {
      hasText: option,
    })
    .first()
    .click();
}

test('authors the chosen font on the block it was opened from', async ({
  page,
}) => {
  const { textbox } = await openFontStylePanel(page);

  await pickFrom(page, 'Font Family', 'Roboto');

  const paragraph = textbox.locator('p', { hasText: PARAGRAPH_TEXT }).first();

  await expect(paragraph).toHaveAttribute(
    'style',
    /font-family:[^;]*Roboto[^;]*sans-serif/
  );
});

test('carries the authored font into the exported email', async ({ page }) => {
  await openFontStylePanel(page);

  await pickFrom(page, 'Font Family', 'Poppins');

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'HTML', exact: true }).click();

  await expect(await getHighlightedCode(page)).toContainText(
    "@font-face {font-family: 'Poppins'"
  );
});

test('authors the size a preset names', async ({ page }) => {
  const { textbox } = await openFontStylePanel(page);

  await pickFrom(page, 'Size presets', 'XL');

  await expect(
    textbox.locator('p', { hasText: PARAGRAPH_TEXT }).first()
  ).toHaveAttribute('style', /font-size:\s*24px/);
});
