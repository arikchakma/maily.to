import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

async function insertLinkCard(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('/card');

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  return { textbox };
}

test('fills a card field from its bubble menu and renders it', async ({
  page,
}) => {
  const { textbox } = await insertLinkCard(page);

  await expect(textbox.locator('[data-mly-image-state]')).toBeVisible();
  await textbox.locator('[data-mly-link-card]').click();

  const menu = page.locator('[data-mly-bubble-menu]');
  await menu.locator('[aria-label="Card Fields"]').click();

  const popover = page.locator('[data-mly-popover]');
  await popover
    .locator('#\\:r0\\:-title')
    .or(popover.locator('[data-mly-field-input]').nth(1))
    .first()
    .fill('Release notes');

  await expect(textbox.locator('[data-mly-link-card-title]')).toHaveText(
    'Release notes'
  );

  const preview = page.frameLocator('iframe[title="Rendered email preview"]');

  await expect(preview.getByText('Release notes').first()).toBeVisible();
});
