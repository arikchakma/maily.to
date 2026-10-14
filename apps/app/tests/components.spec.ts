import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

async function openSlashMenu(page: Page, query: string) {
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

  return { popover, textbox };
}

test('inserts a header template from the components menu', async ({ page }) => {
  const { popover, textbox } = await openSlashMenu(page, 'header');

  await expect(popover.locator('[data-mly-slash-command-title]')).toHaveText([
    'Headers',
  ]);
  await page.keyboard.press('Enter');

  await expect(popover.locator('[data-mly-slash-command-title]')).toHaveText([
    'Logo with Text (Vertical)',
    'Logo with Text (Horizontal)',
    'Logo with Cover Image',
  ]);
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  await expect(textbox.getByRole('heading', { name: 'Maily' })).toBeVisible();

  const preview = page.frameLocator('iframe[title="Rendered email preview"]');
  await expect(preview.getByRole('heading', { name: 'Maily' })).toBeVisible();
  await expect(
    preview.locator('img[src="https://maily.to/brand/logo.png"]')
  ).toHaveAttribute('style', /height:\s*48px/);
});

test('inserts a footer template from the components menu', async ({ page }) => {
  const { popover, textbox } = await openSlashMenu(page, 'footers');

  await expect(popover.locator('[data-mly-slash-command-title]')).toHaveText([
    'Footers',
  ]);
  await page.keyboard.press('Enter');

  await expect(popover.locator('[data-mly-slash-command-title]')).toHaveText([
    'Footer Copyright',
    'Footer Community Feedback',
    'Footer Company Signature',
  ]);
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  const copyright = `Maily © ${new Date().getFullYear()}. All rights reserved.`;

  await expect(textbox.getByText(copyright)).toBeVisible();

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByText(copyright)
  ).toBeVisible();
});
