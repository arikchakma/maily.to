import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

async function insertHtmlBlock(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('/html');

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  return { textbox };
}

test('renders the authored markup into the email', async ({ page }) => {
  const { textbox } = await insertHtmlBlock(page);

  await expect(
    textbox.locator('[data-node-type="htmlCodeBlock"]')
  ).toHaveAttribute('data-active-tab', 'code');

  await page.keyboard.type('<p id="from-html">Hand written</p>');

  const preview = page.frameLocator('iframe[title="Rendered email preview"]');

  await expect(preview.locator('#from-html')).toHaveText('Hand written');
});

test('switches to the preview tab from its bubble menu', async ({ page }) => {
  const { textbox } = await insertHtmlBlock(page);
  await page.keyboard.type('<p>Hand written</p>');

  const block = textbox.locator('[data-node-type="htmlCodeBlock"]');
  const menu = page.locator('[data-mly-bubble-menu]');
  await menu.getByRole('button', { name: 'Preview' }).click();

  await expect(block).toHaveAttribute('data-active-tab', 'preview');
  await expect(textbox.locator('[data-mly-html-code-block]')).toHaveCount(0);
  await expect(
    textbox.locator('[data-mly-html-code-block-preview] p')
  ).toHaveText('Hand written');
});

test('deletes the html block from its bubble menu', async ({ page }) => {
  const { textbox } = await insertHtmlBlock(page);

  await page
    .locator('[data-mly-bubble-menu]')
    .getByRole('button', { name: 'Delete HTML Block' })
    .click();

  await expect(textbox.locator('[data-node-type="htmlCodeBlock"]')).toHaveCount(
    0
  );
});

test('centres the bubble menu over the block', async ({ page }) => {
  const { textbox } = await insertHtmlBlock(page);
  await page.keyboard.type('<p>Hand written</p>');

  const block = textbox.locator('[data-node-type="htmlCodeBlock"]');
  const menu = page.locator('[data-mly-bubble-menu]');

  const blockBox = await block.boundingBox();
  const menuBox = await menu.boundingBox();

  const blockCentre = (blockBox?.x ?? 0) + (blockBox?.width ?? 0) / 2;
  const menuCentre = (menuBox?.x ?? 0) + (menuBox?.width ?? 0) / 2;

  expect(Math.abs(blockCentre - menuCentre)).toBeLessThan(2);
});
