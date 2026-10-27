import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

async function openVisibilityPanel(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).hover();

  const handle = page.locator('[data-mly-drag-handle]');
  await handle.getByRole('button', { name: 'Drag to move' }).click();

  const menu = page.locator('[data-mly-popover][data-variant="drag-context"]');
  await menu.getByRole('button', { name: 'Visibility' }).click();

  const panel = page.locator('[data-mly-visibility-config]');
  await expect(panel).toBeVisible();

  return { panel, textbox };
}

async function pickFrom(page: Page, label: string, option: string) {
  await page
    .locator(`[data-mly-select-trigger][aria-label="${label}"]`)
    .click();
  await page
    .locator('[data-mly-select-content][data-open] [data-mly-select-item]', {
      hasText: option,
    })
    .first()
    .click();
}

async function nameVariable(page: Page, id: string) {
  await page
    .locator('[data-mly-visibility-config] [data-mly-variable-only-editor]')
    .click();
  await page.keyboard.type(id);

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();
}

function getPreview(page: Page) {
  return page.frameLocator('iframe[title="Rendered email preview"]');
}

test('asks for a condition only once an action is chosen', async ({ page }) => {
  const { panel } = await openVisibilityPanel(page);

  await expect(panel.locator('[data-mly-visibility-condition]')).toBeHidden();

  await pickFrom(page, 'Visibility Action', 'Show if');

  await expect(panel.locator('[data-mly-visibility-condition]')).toBeVisible();
});

test('drops the block from the email when a show condition fails', async ({
  page,
}) => {
  const { panel } = await openVisibilityPanel(page);

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeVisible();

  await pickFrom(page, 'Visibility Action', 'Show if');
  await nameVariable(page, 'isSubscribed');
  await pickFrom(page, 'Visibility Operator', 'Is true');

  await expect(panel.locator('[data-mly-field-input]')).toBeHidden();
  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeHidden();
});

test('keeps the block in the email when a hide condition fails', async ({
  page,
}) => {
  await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Hide if');
  await nameVariable(page, 'isSubscribed');
  await pickFrom(page, 'Visibility Operator', 'Is true');

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeVisible();
});

test('compares the variable against a value the panel takes', async ({
  page,
}) => {
  const { panel } = await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Show if');
  await nameVariable(page, 'firstName');
  await panel.locator('[data-mly-field-input]').fill('Grace');

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeHidden();

  await panel.locator('[data-mly-field-input]').fill('Ada');

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeVisible();
});

test('keeps every operator on a single line', async ({ page }) => {
  await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Show if');
  await page
    .locator('[data-mly-select-trigger][aria-label="Visibility Operator"]')
    .click();

  const items = page.locator(
    '[data-mly-select-content][data-variant="visibility-operator"] [data-mly-select-item]'
  );

  await expect(items).toHaveCount(10);

  const wrapped = await items.evaluateAll((elements) => {
    return elements
      .filter((element) => {
        const label = element.querySelector(
          ':scope > :not([data-mly-select-indicator])'
        );

        return (label?.getBoundingClientRect().height ?? 0) > 20;
      })
      .map((element) => {
        return element.textContent;
      });
  });

  expect(wrapped).toEqual([]);
});

test('opens each option list from its own trigger', async ({ page }) => {
  await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Show if');

  for (const [label, variant] of [
    ['Visibility Action', 'visibility-action'],
    ['Visibility Operator', 'visibility-operator'],
  ]) {
    const trigger = page.locator(
      `[data-mly-select-trigger][aria-label="${label}"]`
    );

    await trigger.click();

    const list = page.locator(
      `[data-mly-select-content][data-variant="${variant}"][data-open]`
    );

    await expect(list).toBeVisible();

    const listBox = (await list.boundingBox())!;
    const triggerBox = (await trigger.boundingBox())!;

    const isBelow = listBox.y >= triggerBox.y + triggerBox.height - 1;
    const isAbove = listBox.y + listBox.height <= triggerBox.y + 1;

    expect(Math.round(listBox.x)).toBe(Math.round(triggerBox.x));
    expect(isAbove || isBelow, `${variant} sits away from its trigger`).toBe(
      true
    );
    expect(listBox.y).toBeGreaterThanOrEqual(0);
    expect(listBox.y + listBox.height).toBeLessThanOrEqual(
      page.viewportSize()!.height
    );

    await page.keyboard.press('Escape');
  }
});

test('marks the block the rule sits on', async ({ page }) => {
  const { textbox } = await openVisibilityPanel(page);
  const paragraph = textbox.locator('p', { hasText: PARAGRAPH_TEXT }).first();

  await expect(paragraph).not.toHaveAttribute('data-visibility-action');

  await pickFrom(page, 'Visibility Action', 'Show if');

  await expect(paragraph).toHaveAttribute('data-visibility-action', 'show');
  expect(
    await paragraph.evaluate((element) => {
      return getComputedStyle(element, '::before').maskImage.includes('svg');
    })
  ).toBe(true);

  await page.keyboard.press('Escape');

  const box = (await paragraph.boundingBox())!;
  await paragraph.click({
    position: { x: box.width - 2, y: box.height - 4 },
  });
  await page.keyboard.press('Enter');

  await expect(textbox.locator('[data-visibility-action]')).toHaveCount(1);
});

test('paints an option list above the drag handle it overlaps', async ({
  page,
}) => {
  await page.setViewportSize({ height: 500, width: 1280 });
  await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Show if');
  await page
    .locator('[data-mly-select-trigger][aria-label="Visibility Operator"]')
    .click();
  await expect(
    page.locator(
      '[data-mly-select-content][data-variant="visibility-operator"][data-open]'
    )
  ).toBeVisible();

  const stacking = await page.evaluate(() => {
    const grip = document
      .querySelector('[data-mly-drag-context-trigger]')!
      .getBoundingClientRect();
    const list = document
      .querySelector(
        '[data-mly-select-content][data-variant="visibility-operator"]'
      )!
      .getBoundingClientRect();
    const topmost = document.elementFromPoint(
      grip.x + grip.width / 2,
      grip.y + grip.height / 2
    );

    return {
      overlaps:
        grip.x < list.right &&
        grip.right > list.x &&
        grip.y < list.bottom &&
        grip.bottom > list.y,
      topmost: topmost?.closest('[data-mly-select-item]') !== null,
    };
  });

  expect(stacking).toEqual({ overlaps: true, topmost: true });
});

test('leaves the block alone once the condition is removed', async ({
  page,
}) => {
  await openVisibilityPanel(page);

  await pickFrom(page, 'Visibility Action', 'Show if');
  await nameVariable(page, 'isSubscribed');
  await pickFrom(page, 'Visibility Operator', 'Is true');

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeHidden();

  await pickFrom(page, 'Visibility Action', 'No condition');

  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toBeVisible();
});
