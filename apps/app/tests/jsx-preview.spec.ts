import { expect, test } from 'playwright/test';

import { getHighlightedCode } from './shiki';

test('names react email components in the jsx preview', async ({ page }) => {
  await page.goto('/?fixture');
  await page.getByRole('button', { name: 'React', exact: true }).click();

  const code = await getHighlightedCode(page);
  await expect(code).toContainText('<Html');
  await expect(code).not.toContainText('UnknownElementType');
});
