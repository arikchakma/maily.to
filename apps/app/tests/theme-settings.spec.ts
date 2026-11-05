import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

import { getHighlightedCode } from './shiki';

const PARAGRAPH_TEXT = 'Edit this paragraph and watch the email output change.';

const BAR_SELECTOR = '[data-mly-theme-settings]';

const PANEL_SELECTOR = '[data-mly-popover][data-variant="theme-settings"]';

const JSON_SCROLL_STEP = 320;

function getPreview(page: Page) {
  return page.frameLocator('iframe[title="Rendered email preview"]');
}

async function getJsonSource(page: Page) {
  await page.getByRole('button', { exact: true, name: 'JSON' }).click();

  const source = page.locator('.cm-content');
  await expect(source).toBeVisible();
  await source.hover();

  return source;
}

async function insertButton(page: Page) {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText(PARAGRAPH_TEXT).click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('/butt');

  const suggestion = page.locator('[data-mly-suggestion]');
  await expect(suggestion).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(suggestion).toBeHidden();

  return { textbox };
}

type OpenThemePanelOptions = {
  label: string;
  page: Page;
};

async function openThemePanel(options: OpenThemePanelOptions) {
  const { label, page } = options;

  await page
    .locator(BAR_SELECTOR)
    .getByRole('button', { exact: true, name: label })
    .click();

  const panel = page.locator(PANEL_SELECTOR);
  await expect(panel).toBeVisible();

  return panel;
}

type PickSwatchOptions = {
  field: string;
  page: Page;
  swatch: string;
};

async function pickSwatch(options: PickSwatchOptions) {
  const { field, page, swatch } = options;

  await page
    .locator(`[data-mly-theme-settings-color][aria-label="${field}"]`)
    .click();
  await page
    .locator(`[data-mly-color-swatch] [aria-label="${swatch}"]`)
    .click();
}

type PickOptionOptions = {
  label: string;
  option: string;
  page: Page;
};

async function pickOption(options: PickOptionOptions) {
  const { label, option, page } = options;

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

test('recolors every button from the theme bar', async ({ page }) => {
  const { textbox } = await insertButton(page);

  await openThemePanel({ label: 'Button', page });
  await pickSwatch({ field: 'Background', page, swatch: 'Blue Background' });

  await expect(textbox.locator('[data-node-type="button"]')).toHaveCSS(
    'background-color',
    'rgb(233, 243, 247)'
  );
  await expect(
    getPreview(page).getByRole('link', { name: 'Button' })
  ).toHaveCSS('background-color', 'rgb(233, 243, 247)');
});

test('resizes every button from a size preset', async ({ page }) => {
  await insertButton(page);

  await openThemePanel({ label: 'Button', page });
  await pickOption({ label: 'Button Size', option: 'Large', page });

  await expect(
    getPreview(page).getByRole('link', { name: 'Button' })
  ).toHaveCSS('padding', '14px 40px');
});

test('recolors every paragraph from the theme bar', async ({ page }) => {
  await page.goto('/?fixture');

  await openThemePanel({ label: 'Text', page });
  await pickSwatch({ field: 'Paragraph', page, swatch: 'Red Text' });

  await expect(
    page.getByRole('textbox').first().getByText(PARAGRAPH_TEXT)
  ).toHaveCSS('color', 'rgb(196, 85, 77)');
  await expect(getPreview(page).getByText(PARAGRAPH_TEXT)).toHaveCSS(
    'color',
    'rgb(196, 85, 77)'
  );
});

test('declares the chosen theme font in the exported email', async ({
  page,
}) => {
  await page.goto('/?fixture');

  await openThemePanel({ label: 'Font', page });
  await pickOption({ label: 'Font Family', option: 'Roboto', page });

  await page.keyboard.press('Escape');
  await page.getByRole('button', { exact: true, name: 'HTML' }).click();

  await expect(await getHighlightedCode(page)).toContainText(
    "@font-face {font-family: 'Roboto'"
  );
});

test('carries a container border width into the document', async ({ page }) => {
  await page.goto('/?fixture');

  await openThemePanel({ label: 'Layout', page });

  const width = page.getByLabel('Container Border Width', { exact: true });
  await width.fill('2');
  await width.press('Enter');

  await page.keyboard.press('Escape');

  const source = await getJsonSource(page);

  await expect
    .poll(async () => {
      const text = await source.innerText();
      await page.mouse.wheel(0, JSON_SCROLL_STEP);

      return text;
    })
    .toContain('"borderWidth": "2px"');
});

test('drops the theme bar when the node theme is off', async ({ page }) => {
  await page.goto('/?fixture');

  await expect(page.locator(BAR_SELECTOR)).toBeVisible();

  await page.getByRole('checkbox', { name: 'Node theme' }).uncheck();

  await expect(page.locator(BAR_SELECTOR)).toHaveCount(0);
});

test('paints the body node from the body theme', async ({ page }) => {
  await page.goto('/?blank');

  await openThemePanel({ label: 'Layout', page });
  await pickSwatch({ field: 'Body', page, swatch: 'Blue Background' });

  await expect(page.locator('[data-node-type="body"]')).toHaveCSS(
    'background-color',
    'rgb(233, 243, 247)'
  );
  await expect(getPreview(page).locator('body')).toHaveCSS(
    'background-color',
    'rgb(233, 243, 247)'
  );
});
