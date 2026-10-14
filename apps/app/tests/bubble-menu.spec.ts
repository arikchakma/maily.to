import { expect, test } from 'playwright/test';

test('shows the text bubble menu on selection and applies a mark', async ({
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  const paragraph = textbox.getByText(
    'Edit this paragraph and watch the email output change.'
  );

  const menu = page.locator('[data-mly-bubble-menu]');
  await expect(menu).toBeHidden();

  await paragraph.click({ clickCount: 3 });

  await expect(menu).toBeVisible();

  const bold = menu.getByRole('button', { name: 'Bold' });
  await bold.click();
  await expect(bold).toHaveAttribute('data-active', '');

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByText('Edit this paragraph and watch the email output change.')
  ).toHaveJSProperty('tagName', 'STRONG');
});

test('hides the bubble menu when the selection collapses', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click({ clickCount: 3 });

  const menu = page.locator('[data-mly-bubble-menu]');
  await expect(menu).toBeVisible();

  await page.keyboard.press('ArrowRight');
  await expect(menu).toBeHidden();
});
