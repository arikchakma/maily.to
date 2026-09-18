import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

async function openSlashMenu(page: Page, query = '') {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox
    .getByText('Edit this paragraph and watch the email output change.')
    .click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type(`/${query}`);

  const popover = page.locator('[data-mly-suggestion]');
  await expect(popover).toBeVisible();

  return { popover, textbox };
}

test('inserts a spacer from the block menu and renders it', async ({
  page,
}) => {
  const { popover } = await openSlashMenu(page, 'spac');

  await expect(popover.locator('[data-mly-slash-command-title]')).toHaveText([
    'Spacer',
  ]);
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  await expect(
    page.getByRole('textbox').first().locator('[data-mly-spacer-view]')
  ).toBeVisible();

  await page.getByRole('button', { name: 'JSON', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('"type": "doc"');
});

test('inserts a button from the block menu and renders it in the preview', async ({
  page,
}) => {
  const { popover } = await openSlashMenu(page, 'butt');

  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  await expect(
    page
      .frameLocator('iframe[title="Rendered email preview"]')
      .getByRole('link', { name: 'Button' })
  ).toBeVisible();
});

test('closes the block menu on escape without inserting', async ({ page }) => {
  const { popover, textbox } = await openSlashMenu(page, 'spac');

  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(textbox.locator('[data-mly-spacer-view]')).toHaveCount(0);
});

test('spaces list items apart but not after the last one', async ({ page }) => {
  await page.goto('/?fixture');

  const textbox = page.getByRole('textbox').first();
  await textbox.getByText('Edit this paragraph').click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('- Alpha');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Beta');

  const items = textbox.locator('li');
  await expect(items).toHaveCount(2);

  const margins = await items.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).marginBottom)
  );

  expect(margins).toEqual(['8px', '0px']);
});

test('leaves a section on a triple Enter', async ({ page }) => {
  const { popover, textbox } = await openSlashMenu(page, 'sect');

  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  const section = textbox.locator('[data-node-type="section"]');
  await expect(section).toBeVisible();

  await section.locator('p').click();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Outside');

  await expect(section.locator('p')).toHaveCount(1);
  await expect(textbox.locator('[data-node-type="section"] + p')).toHaveText(
    'Outside'
  );
});

test('keeps an emptied button from being stretched by the prompt', async ({
  page,
}) => {
  const { popover, textbox } = await openSlashMenu(page, 'butt');

  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();

  const button = textbox.locator('[data-node-type="button"]');
  await expect(button).toBeVisible();
  const filled = await button.boundingBox();

  await button.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');

  await expect(button).toHaveText('');
  await expect(button).toHaveAttribute('data-placeholder', '');

  const emptied = await button.boundingBox();
  expect(emptied?.width ?? 0).toBeLessThan(filled?.width ?? 0);
});

test('keeps the block menu from scrolling sideways', async ({ page }) => {
  const { popover } = await openSlashMenu(page);

  const scroll = popover.locator('[data-mly-suggestion-scroll]');
  const overflow = await scroll.evaluate((element) => {
    return {
      overflowX: getComputedStyle(element).overflowX,
      scrollable: element.scrollWidth > element.clientWidth,
    };
  });

  expect(overflow).toEqual({ overflowX: 'hidden', scrollable: false });

  const description = popover
    .locator('[data-mly-slash-command-description]')
    .first();
  await expect(description).toHaveCSS('text-overflow', 'ellipsis');
});

test('fades the block menu edges without a fader element', async ({ page }) => {
  const { popover } = await openSlashMenu(page);

  const scroll = popover.locator('[data-mly-suggestion-scroll]');
  await expect(popover.locator('[data-mly-fader]')).toHaveCount(0);

  const getFade = async () => {
    return scroll.evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        end: styles.getPropertyValue('--mly-scroll-fade-end').trim(),
        masked: styles.maskImage.startsWith('linear-gradient'),
        scrollDriven: CSS.supports('animation-timeline', 'scroll()'),
        start: styles.getPropertyValue('--mly-scroll-fade-start').trim(),
      };
    });
  };

  const resting = await getFade();
  expect(resting.masked).toBe(true);

  if (!resting.scrollDriven) {
    expect(resting.start).toBe(resting.end);
    return;
  }

  await scroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  await expect
    .poll(async () => {
      const scrolled = await getFade();
      return scrolled.start !== resting.start;
    })
    .toBe(true);
});

test('separates the block menu footer whatever the list length', async ({
  page,
}) => {
  const { popover } = await openSlashMenu(page);

  const footer = popover.locator('[data-mly-suggestion-footer]');
  const getShadow = async () => {
    return footer.evaluate((element) => {
      return getComputedStyle(element).boxShadow;
    });
  };

  const long = await getShadow();

  await page.keyboard.type('spac');
  await expect(popover.locator('[data-mly-slash-command-item]')).toHaveCount(1);

  expect({ long, short: await getShadow() }).toEqual({
    long: expect.stringContaining('rgb'),
    short: long,
  });
});
