import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

async function openDirectionPanel(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await menu.getByRole('button', { name: 'Text Direction' }).click();

  const panel = page.locator('[data-mly-text-direction-config]');
  await expect(panel).toBeVisible();

  return { panel, textbox };
}

test('writes the direction on the block it was opened from', async ({
  page,
}) => {
  const { panel, textbox } = await openDirectionPanel(page);
  const paragraph = textbox.locator('p', { hasText: PARAGRAPH_TEXT }).first();

  await panel.getByRole('button', { name: 'Right to Left' }).click();

  await expect(paragraph).toHaveAttribute('dir', 'rtl');
  await expect(paragraph).toHaveAttribute('style', /text-align:\s*right/);

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .locator('p[dir="rtl"]')
      .first()
  ).toBeVisible();
});

test('takes the direction back off the block', async ({ page }) => {
  const { panel, textbox } = await openDirectionPanel(page);
  const paragraph = textbox.locator('p', { hasText: PARAGRAPH_TEXT }).first();

  await panel.getByRole('button', { name: 'Right to Left' }).click();
  await expect(paragraph).toHaveAttribute('dir', 'rtl');

  await panel.getByRole('button', { name: 'Auto' }).click();

  await expect(paragraph).toHaveAttribute('dir', 'auto');
});

test('sizes the panel the way the current editor does', async ({ page }) => {
  const { panel } = await openDirectionPanel(page);
  const popup = page.locator('[data-mly-popover][data-variant="drag-context"]');

  expect(
    await popup.evaluate((element) => {
      const styles = getComputedStyle(element);

      return { padding: styles.padding, width: styles.width };
    })
  ).toEqual({ padding: '4px', width: '192px' });

  await expect(panel.locator('[data-mly-text-direction-option]')).toHaveText([
    'Left to Right',
    'Auto',
    'Right to Left',
  ]);
});
