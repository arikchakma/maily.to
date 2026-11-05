import { expect, test } from 'playwright/test';

test('updates canonical JSON and rendered HTML after editing', async ({
  page,
}) => {
  await page.goto('/?fixture');
  const textbox = page.getByRole('textbox').first();
  const sourceParagraph = textbox.getByText(
    'Edit this paragraph and watch the email output change.'
  );

  await sourceParagraph.click();
  await page.keyboard.press('End');
  await page.keyboard.type(' Live');

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByText(/Live/)
  ).toBeVisible();

  await page.getByRole('button', { name: 'JSON', exact: true }).click();

  await expect(page.locator('.cm-content')).toContainText('"type": "doc"');
});

test('applies the node theme to the editor and the rendered output', async ({
  page,
}) => {
  await page.goto('/?fixture');
  const paragraph = page
    .getByRole('textbox')
    .first()
    .getByText('Edit this paragraph and watch the email output change.');
  const rendered = page
    .frameLocator('iframe[title="Rendered email preview"]')
    .getByText('Edit this paragraph and watch the email output change.');

  await expect(paragraph).toHaveCSS('color', 'rgb(24, 24, 27)');
  await expect(rendered).toHaveCSS('color', 'rgb(24, 24, 27)');

  await page.getByRole('checkbox', { name: 'Node theme' }).uncheck();

  await expect(paragraph).not.toHaveCSS('color', 'rgb(24, 24, 27)');
  await expect(rendered).not.toHaveCSS('color', 'rgb(24, 24, 27)');
});

test('keeps an imported pixel image at its own width', async ({ page }) => {
  await page.goto('/');

  const mark = page
    .getByRole('textbox')
    .first()
    .locator('img[src*="notion-mwn-mark"]');
  await expect(mark).toBeVisible();

  const box = await mark.boundingBox();

  expect(Math.round(box?.width ?? 0)).toBe(24);
});
