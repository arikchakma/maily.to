import { expect, test } from 'playwright/test';

test('stops the spinner animating when motion is reduced', async ({ page }) => {
  await page.goto('/?fixture');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const animationName = await page.evaluate(() => {
    const spinner = document.createElement('span');
    spinner.setAttribute('data-mly-spinner', '');
    document.body.append(spinner);

    const name = getComputedStyle(spinner).animationName;
    spinner.remove();

    return name;
  });

  expect(animationName).toBe('none');
});

test('reaches the editor from the toolbar in one tab', async ({ page }) => {
  await page.goto('/?fixture');

  const toolbar = page.locator('[data-mly-toolbar]');
  await expect(toolbar).toHaveAttribute('role', 'toolbar');

  await page.locator('[data-mly-editor-content]').click();
  await page.keyboard.press('Escape');

  expect(
    await toolbar.evaluate((element) => {
      return [...element.querySelectorAll('button')].filter((button) => {
        return button.tabIndex === 0;
      }).length;
    })
  ).toBe(1);
});
