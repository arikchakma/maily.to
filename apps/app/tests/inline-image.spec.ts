import { expect, test } from 'playwright/test';

const PIXEL =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2218%22 height=%2218%22%3E%3Crect width=%2218%22 height=%2218%22/%3E%3C/svg%3E';

const ICON_ROW =
  `<td style="text-align:center">` +
  `<a href="https://x.test/"><img alt="X" width="18" src="${PIXEL}" style="display:block" /></a>` +
  `<a href="https://in.test/"><img alt="In" width="18" src="${PIXEL}" style="display:block" /></a>` +
  `</td>`;

test('keeps a pasted icon row on one line', async ({ page }) => {
  await page.goto('/?blank');

  const textbox = page.getByRole('textbox').first();
  await textbox.click();
  await page.keyboard.press('ControlOrMeta+End');

  await textbox.evaluate((element, source) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', source);

    const event = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
    });

    // Firefox ignores clipboardData passed to the constructor.
    Object.defineProperty(event, 'clipboardData', { value: clipboardData });

    element.dispatchEvent(event);
  }, ICON_ROW);

  const icons = textbox.locator('img[data-node-type="inlineImage"]');
  await expect(icons).toHaveCount(2);

  const rows = await icons.evaluateAll((elements) => {
    return [
      ...new Set(
        elements.map((element) => {
          return Math.round(element.getBoundingClientRect().y);
        })
      ),
    ];
  });

  expect(rows).toHaveLength(1);
});
