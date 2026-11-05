import type { Locator, Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

const BLOCK_MENU_SHORTCUT = 'ControlOrMeta+Shift+Period';

const MAX_MENU_STEPS = 12;

async function openBlockMenu(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).click();

  await page.keyboard.press(BLOCK_MENU_SHORTCUT);

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await expect(menu).toBeVisible();

  return { menu, textbox };
}

type FocusedMenuItemOptions = {
  menu: Locator;
  name: string;
  page: Page;
};

async function getFocusedMenuItem(options: FocusedMenuItemOptions) {
  const { menu, name, page } = options;
  const item = menu.getByRole('button', { name });

  for (let index = 0; index < MAX_MENU_STEPS; index += 1) {
    const focused = await item.evaluate((element) => {
      return element === document.activeElement;
    });

    if (focused) {
      break;
    }

    await page.keyboard.press('ArrowDown');
  }

  return item;
}

test('opens the block menu with focus inside it', async ({ page }) => {
  const { menu } = await openBlockMenu(page);

  expect(
    await menu.evaluate((element) => {
      return element.contains(document.activeElement);
    })
  ).toBe(true);
});

test('moves a block down without a pointer', async ({ page }) => {
  const { menu, textbox } = await openBlockMenu(page);

  const blocks = textbox.locator('[data-node-type="container"] > *');
  await expect(blocks.first()).toContainText(PARAGRAPH_TEXT);

  const moveDown = await getFocusedMenuItem({
    menu,
    name: 'Move down',
    page,
  });
  await expect(moveDown).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(blocks.first()).not.toContainText(PARAGRAPH_TEXT);
  await expect(blocks.nth(1)).toContainText(PARAGRAPH_TEXT);
});

test('returns focus to the editor when the block menu closes', async ({
  page,
}) => {
  const { menu, textbox } = await openBlockMenu(page);

  await page.keyboard.press('Escape');

  await expect(menu).toBeHidden();
  await expect(textbox).toBeFocused();
});
