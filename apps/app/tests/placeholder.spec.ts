import type { Locator } from 'playwright/test';
import { expect, test } from 'playwright/test';

const PLACEHOLDER_TEXT = 'Write something or / to see commands';

async function getPromptContent(locator: Locator) {
  return locator.evaluate((element) => {
    return getComputedStyle(element, '::before').content;
  });
}

test('prompts an emptied document for content until the writer types', async ({
  browserName,
  page,
}) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Backspace');

  const prompt = textbox.locator('[data-placeholder]');
  await expect(prompt).toHaveAttribute('data-placeholder', PLACEHOLDER_TEXT);

  // Firefox reports the specified value of `content`, so the placeholder text
  // only appears in the computed value on Chromium and WebKit.
  expect(await getPromptContent(prompt)).toContain(
    browserName === 'firefox' ? 'attr(data-placeholder)' : PLACEHOLDER_TEXT
  );

  await page.keyboard.type('Hand written');

  await expect(textbox.locator('[data-placeholder]')).toHaveCount(0);
});
