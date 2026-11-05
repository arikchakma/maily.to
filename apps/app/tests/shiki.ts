import type { Page } from 'playwright/test';
import { expect } from 'playwright/test';

const HIGHLIGHTER_BOOT_TIMEOUT = 20_000;

export async function getHighlightedCode(page: Page) {
  const code = page.locator('.shiki').first();
  await expect(code).toBeVisible({ timeout: HIGHLIGHTER_BOOT_TIMEOUT });

  return code;
}
