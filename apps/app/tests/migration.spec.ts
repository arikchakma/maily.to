import type { Locator, Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const V2_DOC = `{
  "type": "doc",
  "attrs": {
    "version": 2
  },
  "content": []
}`;

const MAX_SCROLL_STEPS = 40;

const getPaneText = async (pane: Locator) => {
  const content = pane.locator('.cm-content');

  await expect(content).toBeVisible();

  const scroller = await content.evaluateHandle((element) => {
    let node: HTMLElement | null = element.parentElement;

    while (node) {
      if (node.scrollHeight > node.clientHeight + 1) {
        return node;
      }

      node = node.parentElement;
    }

    return element;
  });

  let text = '';
  let offset = 0;

  for (let step = 0; step < MAX_SCROLL_STEPS; step += 1) {
    await scroller.evaluate((element, top) => {
      element.scrollTop = top;
    }, offset);

    text += `\n${await content.innerText()}`;

    const metrics = await scroller.evaluate((element) => {
      return {
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
      };
    });

    if (metrics.scrollTop + metrics.clientHeight >= metrics.scrollHeight - 1) {
      break;
    }

    offset = metrics.scrollTop + metrics.clientHeight;
  }

  return text;
};

type SetInputOptions = {
  page: Page;
  value: string;
};

const setInput = async (options: SetInputOptions) => {
  const { page, value } = options;

  const content = page.locator('[data-migration-input] .cm-content');
  await content.click();
  await content.fill(value);
  await expect(content).toContainText(value.split('\n')[1]!.trim());
};

const getWarningCount = async (page: Page) => {
  const summary = page.locator('[data-migration-warnings] summary');
  const label = await summary.innerText();

  return Number(label.match(/\((\d+)\)/)?.[1] ?? '0');
};

test('migrates the sample document on load', async ({ page }) => {
  await page.goto('/migration');

  const output = page.locator('[data-migration-output]');

  await expect
    .poll(() => {
      return getPaneText(output);
    })
    .toContain('"version": 2');

  expect(await getPaneText(output)).not.toContain('showIfKey');
});

test('summarises and lists the migration warnings', async ({ page }) => {
  await page.goto('/migration');

  const warnings = page.locator('[data-migration-warnings]');
  await expect(warnings).toBeVisible();

  expect(await getWarningCount(page)).toBeGreaterThan(0);

  await warnings.locator('summary').click();

  await expect(
    warnings.getByText('button.text', { exact: true }).first()
  ).toBeVisible();
  await expect(
    warnings.getByText('for.type', { exact: true }).first()
  ).toBeVisible();
});

test('shows the document diff', async ({ page }) => {
  await page.goto('/migration');
  await page.getByRole('button', { name: 'Diff' }).click();

  await expect(page.locator('[data-migration-mode]')).toHaveAttribute(
    'data-mode',
    'diff'
  );

  const diff = page.locator('[data-migration-diff]');
  await expect(diff).toContainText('v2-document.json');
  await expect(diff).toContainText('showIfKey');
});

test('renders the migrated document in the preview', async ({ page }) => {
  await page.goto('/migration');
  await page.getByRole('button', { name: 'Preview' }).click();

  await expect(page.locator('[data-migration-mode]')).toHaveAttribute(
    'data-mode',
    'preview'
  );

  const preview = page.frameLocator('[data-migration-preview]');
  await expect(preview.locator('body')).toContainText('The Monthly Dispatch');
  await expect(preview.locator('body')).toContainText('Read the deep dive');
});

test('reports invalid input', async ({ page }) => {
  await page.goto('/migration');
  await setInput({ page, value: '{\n  "type": "doc",\n' });

  await expect(page.locator('[data-migration-error]')).toContainText(/JSON/i);
});

test('leaves a v2 document untouched', async ({ page }) => {
  await page.goto('/migration');
  await setInput({ page, value: V2_DOC });

  await expect(page.locator('[data-migration-warnings]')).toHaveCount(0);

  const input = await getPaneText(page.locator('[data-migration-input]'));
  const output = await getPaneText(page.locator('[data-migration-output]'));

  expect(output.trim()).toBe(input.trim());
});

test('restores the sample document', async ({ page }) => {
  await page.goto('/migration');
  await setInput({ page, value: V2_DOC });

  await expect(page.locator('[data-migration-warnings]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Load sample' }).click();

  await expect(page.locator('[data-migration-warnings]')).toBeVisible();
  expect(await getWarningCount(page)).toBeGreaterThan(0);
});
