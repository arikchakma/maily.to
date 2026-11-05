import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { TextBubbleMenu } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Turn me into a heading' }],
  },
]);

async function findTrigger() {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-bubble-button][aria-label="Turn into"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

function getIconName(element: HTMLElement) {
  return element.querySelector('svg')?.getAttribute('class') ?? null;
}

async function openTurnInto() {
  await userEvent.click(await findTrigger());

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-dropdown-menu][data-variant="turn-into"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

type GetOptionOptions = { menu: HTMLElement; title: string };

function getOption(options: GetOptionOptions) {
  const { menu, title } = options;

  return [
    ...menu.querySelectorAll<HTMLElement>('[data-mly-dropdown-menu-item]'),
  ].find((item) => {
    return item.textContent === title;
  });
}

describe('turn into block', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    const { ref } = await render({
      children: <TextBubbleMenu />,
      content: DOCUMENT,
      styled: true,
    });

    const editor = ref.current!.getEditor();
    editor.chain().focus().setTextSelection({ from: 3, to: 10 }).run();

    return editor;
  };

  describe('the dropdown', () => {
    it('lists the blocks a selection can turn into', async () => {
      await mountEditor();

      const menu = await openTurnInto();

      expect({
        categories: [
          ...menu.querySelectorAll('[data-mly-dropdown-menu-category]'),
        ].map((category) => {
          return category.textContent;
        }),
        options: [
          ...menu.querySelectorAll('[data-mly-dropdown-menu-item]'),
        ].map((item) => {
          return item.textContent;
        }),
      }).toEqual({
        categories: ['Hierarchy', 'Lists'],
        options: [
          'Paragraph',
          'Heading 1',
          'Heading 2',
          'Heading 3',
          'Footer',
          'Bullet list',
          'Numbered list',
        ],
      });
    });

    it('sizes the menu the way the current Maily repository sizes it', async () => {
      await mountEditor();

      const menu = await openTurnInto();
      const item = menu.querySelector('[data-mly-dropdown-menu-item]')!;
      const category = menu.querySelector('[data-mly-dropdown-menu-category]')!;
      const menuStyle = getComputedStyle(menu);
      const itemStyle = getComputedStyle(item);
      const categoryStyle = getComputedStyle(category);

      expect({
        categoryFontSize: categoryStyle.fontSize,
        categoryLineHeight: categoryStyle.lineHeight,
        categoryMarginTop: categoryStyle.marginTop,
        categoryPaddingLeft: categoryStyle.paddingLeft,
        categoryWeight: categoryStyle.fontWeight,
        itemColor: itemStyle.color,
        itemGap: itemStyle.columnGap,
        itemHeight: item.getBoundingClientRect().height,
        itemPadding: `${itemStyle.paddingTop} ${itemStyle.paddingLeft}`,
        itemRadius: itemStyle.borderRadius,
        itemWeight: itemStyle.fontWeight,
        menuPadding: menuStyle.padding,
        menuRadius: menuStyle.borderRadius,
        menuWidth: menu.getBoundingClientRect().width,
        menuZIndex: menuStyle.zIndex,
      }).toEqual({
        categoryFontSize: '12px',
        categoryLineHeight: '16px',
        categoryMarginTop: '4px',
        categoryPaddingLeft: '8px',
        categoryWeight: '500',
        itemColor: 'rgb(106, 114, 130)',
        itemGap: '8px',
        itemHeight: 28,
        itemPadding: '4px 8px',
        itemRadius: '8px',
        itemWeight: '400',
        menuPadding: '4px',
        menuRadius: '12px',
        menuWidth: 160,
        menuZIndex: '50',
      });
    });
  });

  describe('converting', () => {
    it('turns the block into the chosen one', async () => {
      const editor = await mountEditor();

      const menu = await openTurnInto();
      await userEvent.click(getOption({ menu, title: 'Heading 2' })!);

      await waitFor(() => {
        expect(editor.isActive('heading', { level: 2 })).toBe(true);
      });
    });

    it('shows the icon of the active block on the trigger', async () => {
      const editor = await mountEditor();

      const trigger = await findTrigger();
      const before = getIconName(trigger);

      editor.chain().focus().toggleBulletList().run();

      await waitFor(() => {
        expect(getIconName(trigger)).not.toBe(before);
      });

      const menu = await openTurnInto();

      expect(getIconName(trigger)).toBe(
        getIconName(getOption({ menu, title: 'Bullet list' })!)
      );
    });
  });
});
