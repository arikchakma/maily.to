import { expect, test } from 'playwright/test';

test('turns a paragraph into a heading from the bubble menu', async ({
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  const paragraph = textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .first();
  await paragraph.click();
  await page.keyboard.press('ControlOrMeta+a');

  await page.locator('[data-mly-bubble-menu] [aria-label="Turn into"]').click();

  const dropdown = page.locator('[data-mly-dropdown-menu]');
  await expect(dropdown).toBeVisible();
  await dropdown.getByText('Heading 2').click();

  await expect(
    textbox.locator('h2', {
      hasText: 'Edit this paragraph and watch the email output change.',
    })
  ).toBeVisible();
});
