import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

test('completes a sentence from the inline suggestion', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Writing this ');

  const ghost = textbox.locator('[data-inline-suggestion]');
  await expect(ghost).toHaveCount(1);

  await page.keyboard.press('Tab');

  await expect(textbox).toContainText('Writing this');
  await expect(ghost).toHaveCount(0);
});

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

type GetAIDropdownOptions = {
  mode?: 'fail' | 'oneshot';
  page: Page;
};

async function getAIDropdown(options: GetAIDropdownOptions) {
  const { mode, page } = options;

  await page.goto(mode ? `/?fixture&ai=${mode}` : '/?fixture');

  const textbox = page.getByRole('textbox').first();
  const paragraph = textbox.locator('p').first();
  await expect(paragraph).toHaveText(PARAGRAPH_TEXT);

  await paragraph.click({ clickCount: 3 });

  const menu = page.locator('[data-mly-bubble-menu]');
  await expect(menu).toBeVisible();
  await menu.locator('[aria-label="AI Actions"]').click();

  const dropdown = page.locator(
    '[data-mly-dropdown-menu][data-variant="ai-actions"]'
  );
  await expect(dropdown).toBeVisible();

  return { dropdown, menu, paragraph, textbox };
}

test('lists every ai action in the dropdown from the text bubble menu', async ({
  page,
}) => {
  const { dropdown } = await getAIDropdown({ page });

  await expect(dropdown.locator('[data-mly-dropdown-menu-item]')).toHaveText([
    'Improve Writing',
    'Fix Grammar',
    'Make Shorter',
    'Make Longer',
    'Simplify Language',
  ]);
});

test('shows the loading state and announces the running action', async ({
  page,
}) => {
  const { dropdown, menu, paragraph, textbox } = await getAIDropdown({
    mode: 'oneshot',
    page,
  });

  const trigger = menu.locator('[aria-label="AI Actions"]');
  await dropdown.getByText('Make Longer').click();

  await expect(trigger.locator('[data-mly-spinner]')).toBeVisible();
  await expect(textbox.getByRole('status')).toHaveText('Running make-longer');
  await expect(textbox.locator('[data-mly-ai-loading]')).toHaveText(
    PARAGRAPH_TEXT
  );

  await expect(paragraph).toHaveText(`Longer: ${PARAGRAPH_TEXT}`);
  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByText(`Longer: ${PARAGRAPH_TEXT}`)
  ).toBeVisible();

  await paragraph.click({ clickCount: 3 });

  await expect(trigger).toBeVisible();
  await expect(trigger.locator('[data-mly-spinner]')).toHaveCount(0);
  await expect(textbox.getByRole('status')).toHaveCount(0);
  await expect(textbox.locator('[data-mly-ai-spinner]')).toHaveCount(0);
});

test('spins on the text while the bubble menu is gone', async ({ page }) => {
  const { dropdown, paragraph, textbox } = await getAIDropdown({ page });

  await dropdown.getByText('Improve Writing').click();

  await expect
    .poll(
      async () => {
        return page.evaluate(() => {
          const spinner = document.querySelector('[data-mly-ai-spinner]');
          const menu = document.querySelector('[data-mly-bubble-menu]');

          return { menu: Boolean(menu), spinner: Boolean(spinner) };
        });
      },
      { intervals: [20], timeout: 15_000 }
    )
    .toEqual({ menu: false, spinner: true });

  await expect(textbox.getByRole('status')).toHaveText('Running improve');

  await expect(paragraph).toHaveText(`Improved: ${PARAGRAPH_TEXT}`, {
    timeout: 15_000,
  });

  await expect(textbox.locator('[data-mly-ai-spinner]')).toHaveCount(0);
  await expect(textbox.locator('[data-mly-ai-loading]')).toHaveCount(0);
});

test('streams the result progressively into the selection', async ({
  page,
}) => {
  const { dropdown, paragraph } = await getAIDropdown({ page });
  const result = `Improved: ${PARAGRAPH_TEXT}`;

  await dropdown.getByText('Improve Writing').click();

  const seen = new Set<string>();

  await expect
    .poll(
      async () => {
        seen.add((await paragraph.textContent()) ?? '');

        return seen.has(result);
      },
      { intervals: [30], timeout: 15_000 }
    )
    .toBe(true);

  expect(seen.size).toBeGreaterThan(2);
  await expect(paragraph).toHaveText(result);
});

test('undoes a streamed ai action in a single step', async ({ page }) => {
  const { dropdown, paragraph } = await getAIDropdown({ page });

  await dropdown.getByText('Simplify Language').click();
  await expect(paragraph).toHaveText(`Simplified: ${PARAGRAPH_TEXT}`, {
    timeout: 15_000,
  });

  await page.keyboard.press('ControlOrMeta+z');

  await expect(paragraph).toHaveText(PARAGRAPH_TEXT);
});

test('surfaces a failed ai action and restores the trigger on dismiss', async ({
  page,
}) => {
  const { dropdown, menu, paragraph } = await getAIDropdown({
    mode: 'fail',
    page,
  });

  await dropdown.getByText('Improve Writing').click();

  const alert = menu.locator('[data-mly-ai-error]');
  await expect(alert).toBeVisible();
  await expect(alert).toHaveAttribute('role', 'alert');
  await expect(alert).toContainText('Improve Writing failed');
  await expect(paragraph).toHaveText(PARAGRAPH_TEXT);
  await expect(menu.locator('[aria-label="AI Actions"]')).toHaveCount(0);

  await alert.getByRole('button', { name: 'Dismiss' }).click();

  await expect(alert).toHaveCount(0);
  await expect(menu.locator('[aria-label="AI Actions"]')).toBeVisible();
});
