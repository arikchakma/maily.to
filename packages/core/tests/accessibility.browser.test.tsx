import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { Editor, TextBubbleMenu, Toolbar } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Name every control' }],
  },
]);

function getUnnamedButtons(root: ParentNode) {
  return [...root.querySelectorAll<HTMLButtonElement>('button')]
    .filter((button) => {
      const label = button.getAttribute('aria-label');
      const text = button.textContent?.trim();

      return !(label?.trim() || text);
    })
    .map((button) => {
      return button.outerHTML.slice(0, 80);
    });
}

describe('accessibility', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({
      children: (
        <>
          <TextBubbleMenu />
          <Editor.DragContextHandle />
        </>
      ),
      content: DOCUMENT,
      styled: true,
      toolbar: (
        <Toolbar.Root>
          <Toolbar.CommonActions />
        </Toolbar.Root>
      ),
      wrapper: { padding: 64 },
    });
  };

  describe('names and states', () => {
    it('names every control in the toolbar', async () => {
      const { view } = await mountEditor();

      const toolbar = view.container.querySelector('[data-mly-toolbar]')!;

      expect(toolbar.querySelectorAll('button').length).toBeGreaterThan(5);
      expect(getUnnamedButtons(toolbar)).toEqual([]);
    });

    it('names every control in the text bubble menu', async () => {
      const { ref } = await mountEditor();

      ref.current!.getEditor().chain().focus().selectAll().run();

      const menu = await waitFor(() => {
        const found = document.querySelector('[data-mly-bubble-menu]');
        expect(found).not.toBeNull();
        return found!;
      });

      expect(menu.querySelectorAll('button').length).toBeGreaterThan(5);
      expect(getUnnamedButtons(menu)).toEqual([]);
    });

    it('marks a pressed control for assistive technology', async () => {
      const { ref, view } = await mountEditor();

      ref.current!.getEditor().chain().focus().selectAll().toggleBold().run();

      const bold = await waitFor(() => {
        const found = view.container.querySelector<HTMLButtonElement>(
          '[data-mly-toolbar] [aria-label="Bold"]'
        );
        expect(found?.getAttribute('aria-pressed')).toBe('true');
        return found!;
      });

      expect(bold.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('focus management', () => {
    it('keeps focus in the editor while the slash menu is open', async () => {
      const { editable, ref } = await mountEditor();

      await userEvent.click(editable);
      ref.current!.getEditor().chain().focus('end').run();
      await userEvent.keyboard('{Enter}/');

      const menu = await waitFor(() => {
        const found = document.querySelector('[data-mly-suggestion]');
        expect(found).not.toBeNull();
        return found!;
      });

      expect({
        focused: document.activeElement === editable,
        inMenu: menu.contains(document.activeElement),
      }).toEqual({ focused: true, inMenu: false });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(document.querySelector('[data-mly-suggestion]')).toBeNull();
      });

      expect(document.activeElement).toBe(editable);
    });

    it('returns focus to the trigger when the block menu closes', async () => {
      await mountEditor();

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

      trigger.focus();
      await userEvent.keyboard('{Enter}');

      const menu = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-popover][data-variant="drag-context"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      await waitFor(() => {
        expect(menu.contains(document.activeElement)).toBe(true);
      });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          document.querySelector(
            '[data-mly-popover][data-variant="drag-context"]'
          )
        ).toBeNull();
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });
  });
});
