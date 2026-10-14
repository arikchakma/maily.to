import type { Locator, Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const SOURCE =
  '<h2 style="color:#111827">Pasted title</h2><p><b>Pasted bold</b></p>';

type PasteOptions = {
  target: Locator;
  text: string;
};

async function paste(options: PasteOptions) {
  const { target, text } = options;

  await target.evaluate((element, source) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', source);

    const event = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
    });

    // Firefox ignores clipboardData passed to the constructor.
    Object.defineProperty(event, 'clipboardData', { value: clipboardData });

    element.dispatchEvent(event);
  }, text);
}

async function getEmptyEditor(page: Page) {
  await page.goto('/?blank');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+End');

  return textbox;
}

test('turns markup pasted as text into blocks and renders them', async ({
  page,
}) => {
  const textbox = await getEmptyEditor(page);

  await paste({ target: textbox, text: SOURCE });

  await expect(textbox.locator('h2')).toHaveText('Pasted title');
  await expect(textbox.locator('strong')).toHaveText('Pasted bold');
  await expect(
    page.frameLocator('iframe[title="Rendered email preview"]').locator('h2')
  ).toHaveText('Pasted title');
});

test('leaves the markup as text when the paste is undone', async ({ page }) => {
  const textbox = await getEmptyEditor(page);

  await paste({ target: textbox, text: SOURCE });
  await expect(textbox.locator('h2')).toHaveText('Pasted title');

  await page.keyboard.press('ControlOrMeta+Z');

  await expect(textbox.locator('h2')).toHaveCount(0);
  await expect(textbox).toHaveText(SOURCE);
});

test('keeps the markup as text while shift is held', async ({ page }) => {
  const textbox = await getEmptyEditor(page);

  await page.keyboard.down('Shift');
  await paste({ target: textbox, text: SOURCE });
  await page.keyboard.up('Shift');

  await expect(textbox).toHaveText(SOURCE);
  await expect(textbox.locator('h2')).toHaveCount(0);
});

test('converts a paste from the real clipboard', async ({
  browserName,
  context,
  page,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Playwright grants clipboard permission on Chromium only'
  );

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const textbox = await getEmptyEditor(page);
  await page.evaluate((text) => {
    return navigator.clipboard.writeText(text);
  }, SOURCE);

  await page.keyboard.press('ControlOrMeta+V');
  await expect(textbox.locator('h2')).toHaveText('Pasted title');

  await page.keyboard.press('ControlOrMeta+Z');
  await expect(textbox).toHaveText(SOURCE);
});
