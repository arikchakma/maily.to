import { expect, test } from 'playwright/test';

test('applies a mark from the toolbar', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('ControlOrMeta+a');

  const bold = page.locator('[data-mly-toolbar] [aria-label="Bold"]');
  await expect(bold).not.toHaveAttribute('data-active', '');
  await bold.click();

  await expect(bold).toHaveAttribute('data-active', '');
  await expect(textbox.locator('strong').first()).toBeVisible();
});

test('writes the chosen alignment from the toolbar', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  const paragraph = textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .first();
  await paragraph.click();

  await page.locator('[data-mly-toolbar] [aria-label="Alignment"]').click();
  await page.locator('[aria-label="Align Center"]').click();

  await expect(paragraph).toHaveAttribute('style', /text-align:\s*center/);
});

test('undoes the last change from the toolbar', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.type(' and again');

  const undo = page.locator('[data-mly-toolbar] [aria-label="Undo"]');
  await expect(undo).toBeEnabled();
  await undo.click();

  await expect(textbox).not.toContainText('and again');
});

test('changes the editor text direction from the toolbar', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await expect(textbox).not.toHaveAttribute('dir', 'rtl');

  await page.locator('[data-mly-toolbar] [aria-label="Direction"]').click();
  await page.locator('[aria-label="Right to Left"]').click();

  await expect(textbox).toHaveAttribute('dir', 'rtl');
  await expect(
    page.frameLocator('iframe').first().locator('html')
  ).toHaveAttribute('dir', 'rtl');
});
