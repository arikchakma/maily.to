import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

async function openDragContextMenu(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await expect(handle).toBeVisible();

  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await expect(menu).toBeVisible();

  return { handle, menu, textbox };
}

test('opens the drag context menu from the handle', async ({ page }) => {
  const { menu } = await openDragContextMenu(page);

  await expect(menu.locator('[data-mly-drag-context-item]')).toHaveText([
    'Reset formatting',
    'Font Style',
    'Text Direction',
    'Visibility',
    'Duplicate',
    'Copy to clipboard',
    'Move up',
    'Move down',
    'Delete',
  ]);
});

test('hides the bubble menus while the block menu is open', async ({
  page,
}) => {
  const { menu } = await openDragContextMenu(page);
  const bubbleMenus = page.locator('[data-mly-floating-element]');

  await expect(bubbleMenus).toHaveCount(0);

  await page.keyboard.press('Escape');

  await expect(menu).toBeHidden();
  await expect(bubbleMenus.first()).toBeVisible();
});

test('duplicates the hovered block', async ({ page }) => {
  const { menu, textbox } = await openDragContextMenu(page);

  await menu.getByRole('button', { name: 'Duplicate' }).click();

  await expect(textbox.getByText(PARAGRAPH_TEXT)).toHaveCount(2);
});

test('deletes the hovered block', async ({ page }) => {
  const { menu, textbox } = await openDragContextMenu(page);

  await menu.getByRole('button', { name: 'Delete' }).click();

  await expect(textbox.getByText(PARAGRAPH_TEXT)).toHaveCount(0);
});

test('moves the hovered block down past its sibling', async ({ page }) => {
  const { menu, textbox } = await openDragContextMenu(page);

  const blocks = textbox.locator('[data-node-type="container"] > *');
  await expect(blocks.first()).toContainText(PARAGRAPH_TEXT);

  await menu.getByRole('button', { name: 'Move down' }).click();

  await expect(blocks.last()).toContainText(PARAGRAPH_TEXT);
});

test('disables moving the first block up', async ({ page }) => {
  const { menu } = await openDragContextMenu(page);

  await expect(menu.getByRole('button', { name: 'Move up' })).toBeDisabled();
  await expect(menu.getByRole('button', { name: 'Move down' })).toBeEnabled();
});

test('adds a block below and opens the slash menu', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Add block' }).click();

  await expect(page.locator('[data-mly-suggestion]')).toBeVisible();
});

test('clears the list marker when the handle targets a list item', async ({
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('- Alpha');

  const item = textbox.locator('li').first();
  await expect(item).toBeVisible();
  await item.hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await expect(handle).toBeVisible();

  const list = textbox.locator('ul').first();
  const handleBox = await handle.boundingBox();
  const listBox = await list.boundingBox();
  const itemBox = await item.boundingBox();

  expect(Math.round(itemBox?.x ?? 0)).toBeGreaterThan(
    Math.round(listBox?.x ?? 0)
  );
  expect(Math.round((handleBox?.x ?? 0) + (handleBox?.width ?? 0))).toBe(
    Math.round(listBox?.x ?? 0)
  );
});

test('keeps the handle on the block an open menu edited', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  const target = textbox.getByText('Left column');
  await target.hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const before = await handle.boundingBox();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await menu.getByRole('button', { name: 'Font Style' }).click();

  await page
    .locator('[data-mly-select-trigger][aria-label="Font Family"]')
    .click();
  await page
    .locator('[data-mly-select-content][data-open] [data-mly-select-item]', {
      hasText: 'Roboto',
    })
    .first()
    .click();

  await expect(target).toHaveAttribute('style', /font-family:[^;]*Roboto/);

  const after = await handle.boundingBox();

  expect({
    x: Math.round(after?.x ?? 0),
    y: Math.round(after?.y ?? 0),
  }).toEqual({
    x: Math.round(before?.x ?? 0),
    y: Math.round(before?.y ?? 0),
  });
});

test('acts on the block an open menu edited, not another', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText('Left column').hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await menu.getByRole('button', { name: 'Font Style' }).click();

  await page
    .locator('[data-mly-select-trigger][aria-label="Font Family"]')
    .click();
  await page
    .locator('[data-mly-select-content][data-open] [data-mly-select-item]', {
      hasText: 'Roboto',
    })
    .first()
    .click();

  await page.locator('[data-mly-popover-back]').click();
  await menu.getByRole('button', { name: 'Delete' }).click();

  await expect(textbox.getByText('Left column')).toHaveCount(0);
  await expect(textbox.getByText(PARAGRAPH_TEXT)).toHaveCount(1);
});
