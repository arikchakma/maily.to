import { expect, test } from 'playwright/test';

test('inserts a variable from the suggestion popup and renders its value', async ({
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.type(' {{');

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await expect(popover.locator('[data-mly-suggestion-item]')).toHaveText([
    'firstName',
    'lastName',
    'email',
  ]);

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(popover).toBeHidden();
  await expect(textbox.locator('[data-mly-variable]')).toHaveText(
    '{{ lastName }}'
  );

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByText('Lovelace')
  ).toBeVisible();
});

test('filters the suggestion popup as the query is typed', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.type(' {{la');

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover.locator('[data-mly-suggestion-item]')).toHaveText([
    'lastName',
    'la',
  ]);

  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
});

test('keeps the other bubble menus open while a field is focused', async ({
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.type(' {{');
  await expect(page.locator('[data-mly-suggestion]')).toBeVisible();
  await page.keyboard.type('name');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-mly-suggestion]')).toBeHidden();

  const pill = textbox.locator('[data-node-type="variable"]').first();
  await expect(pill).toBeVisible();

  const menus = page.locator('[data-mly-floating-element]');

  await expect(async () => {
    await pill.click();
    await expect(menus).toHaveCount(2, { timeout: 1000 });
  }).toPass({ timeout: 10000 });

  await page
    .locator('[data-mly-floating-element="variable-bubble-menu"] input')
    .first()
    .click();

  await expect(menus).toHaveCount(2);
});

test('shows the enter affordance on both variable fields', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.type(' {{');
  await expect(page.locator('[data-mly-suggestion]')).toBeVisible();
  await page.keyboard.type('name');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-mly-suggestion]')).toBeHidden();

  const pill = textbox.locator('[data-node-type="variable"]').first();
  const menu = page.locator(
    '[data-mly-floating-element="variable-bubble-menu"]'
  );

  await expect(async () => {
    await pill.click();
    await expect(menu).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 10000 });

  await expect(menu.locator('[data-mly-field-icon]')).toHaveCount(2);
  await expect(menu.getByLabel('Variable')).toBeVisible();
  await expect(menu.getByLabel('Default Value')).toBeVisible();
});
