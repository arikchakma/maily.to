import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { Editor, Toolbar } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Constrain my chrome' }],
  },
]);

async function openDragMenu() {
  await userEvent.hover(
    document.querySelector<HTMLElement>('[contenteditable="true"] p')!
  );

  const trigger = await waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-drag-context-trigger]'
    );
    expect(found).not.toBeNull();
    return found!;
  });

  await userEvent.click(trigger);

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-drag-context-items]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

describe('overflow', () => {
  const { render } = createRenderer();

  type MountEditorOptions = {
    width?: number;
    withToolbar?: boolean;
  };

  const mountEditor = async (options: MountEditorOptions = {}) => {
    const { width = 640, withToolbar = false } = options;

    return render({
      children: <Editor.DragContextHandle />,
      content: DOCUMENT,
      styled: true,
      theme: true,
      toolbar: withToolbar ? (
        <Toolbar.Root>
          <Toolbar.CommonActions />
        </Toolbar.Root>
      ) : null,
      wrapper: { padding: 24, width },
    });
  };

  describe('the drag menu', () => {
    it('truncates a label that sits beside a fixed affordance', async () => {
      await mountEditor();
      const items = await openDragMenu();

      const label = items.querySelector<HTMLElement>(
        '[data-mly-drag-context-item] > :not([data-mly-drag-context-item-chevron])'
      )!;

      expect({
        overflow: getComputedStyle(label).overflow,
        textOverflow: getComputedStyle(label).textOverflow,
        whiteSpace: getComputedStyle(label).whiteSpace,
      }).toEqual({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    it('lets a select trigger shrink rather than push its chevron out', async () => {
      await mountEditor();
      await openDragMenu();

      const fontStyle = [
        ...document.querySelectorAll<HTMLElement>(
          '[data-mly-drag-context-item]'
        ),
      ].find((item) => {
        return item.textContent?.startsWith('Font Style');
      })!;
      await userEvent.click(fontStyle);

      const trigger = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-select-trigger]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      const icon = trigger.querySelector<HTMLElement>(
        '[data-mly-select-icon]'
      )!;

      expect({
        iconInside:
          Math.round(icon.getBoundingClientRect().right) <=
          Math.round(trigger.getBoundingClientRect().right),
        shrink: getComputedStyle(trigger).flexShrink,
      }).toEqual({ iconInside: true, shrink: '1' });
    });

    it('scrolls the drag menu list and fades it, not the card', async () => {
      await mountEditor();
      const items = await openDragMenu();

      const card = items.closest<HTMLElement>('[data-mly-popover]')!;

      expect({
        cardMask: getComputedStyle(card).maskImage,
        cardOverflow: getComputedStyle(card).overflowY,
        listBounded: getComputedStyle(items).maxHeight !== 'none',
        listMask:
          getComputedStyle(items).maskImage.startsWith('linear-gradient'),
        listOverflow: getComputedStyle(items).overflowY,
        scrollbarWidth: getComputedStyle(items).scrollbarWidth,
      }).toEqual({
        cardMask: 'none',
        cardOverflow: 'visible',
        listBounded: true,
        listMask: true,
        listOverflow: 'auto',
        scrollbarWidth: 'none',
      });
    });
  });

  it('wraps the toolbar instead of running past a narrow container', async () => {
    await mountEditor({ width: 200, withToolbar: true });

    const toolbar = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('[data-mly-toolbar]');
      expect(found).not.toBeNull();
      return found!;
    });

    const groups = [
      ...toolbar.querySelectorAll<HTMLElement>('[data-mly-toolbar-group]'),
    ];
    const rows = new Set(
      groups.map((group) => {
        return Math.round(group.getBoundingClientRect().top);
      })
    );

    expect({
      fitsWidth:
        Math.round(toolbar.getBoundingClientRect().right) <=
        Math.round(toolbar.parentElement!.getBoundingClientRect().right),
      wrapped: rows.size > 1,
    }).toEqual({ fitsWidth: true, wrapped: true });
  });
});
