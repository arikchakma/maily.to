import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'First block' }],
  },
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Second block' }],
  },
]);

const MENU_SELECTOR = '[data-mly-popover][data-variant="drag-context"]';

const MODIFIER = navigator.platform.includes('Mac') ? 'Meta' : 'Control';

type FocusCaretAtEndOptions = {
  editable: HTMLElement;
  handle: Editor.Root.Handle;
};

async function focusCaretAtEnd(options: FocusCaretAtEndOptions) {
  const { editable, handle } = options;
  handle.getEditor().commands.focus('end');

  await waitFor(() => {
    expect(document.activeElement).toBe(editable);
  });
}

async function pressBlockMenuShortcut() {
  await userEvent.keyboard(`{${MODIFIER}>}{Shift>}.{/Shift}{/${MODIFIER}}`);
}

function getBlockMenu() {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(MENU_SELECTOR);
    expect(found).not.toBeNull();
    return found!;
  });
}

type GetMenuItemOptions = { label: string; menu: HTMLElement };

function getMenuItem(options: GetMenuItemOptions) {
  const { label, menu } = options;
  const found = [
    ...menu.querySelectorAll<HTMLButtonElement>('[data-mly-drag-context-item]'),
  ].find((item) => {
    return item.textContent === label;
  });

  expect(found).not.toBeUndefined();

  return found!;
}

function getParagraphs() {
  return [...document.querySelectorAll('[contenteditable="true"] p')].map(
    (paragraph) => {
      return paragraph.textContent;
    }
  );
}

async function waitTwoFrames() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe('<DragContextHandle />', () => {
  const { render } = createRenderer();

  const mountEditor = async (options: { editable?: boolean } = {}) => {
    const { editable = true } = options;

    return render({
      children: <Editor.DragContextHandle />,
      content: DOCUMENT,
      editable,
      styled: true,
      wrapper: { padding: 64 },
    });
  };

  describe('the keyboard shortcut', () => {
    it('opens the block menu on the caret block without a pointer', async () => {
      const { editable, ref } = await mountEditor();
      await focusCaretAtEnd({ editable, handle: ref.current! });

      const handle = document.querySelector<HTMLElement>(
        '[data-mly-drag-handle]'
      )!;
      expect(getComputedStyle(handle).visibility).toBe('hidden');

      await pressBlockMenuShortcut();

      const menu = await getBlockMenu();

      await waitFor(() => {
        expect({
          handleVisibility: getComputedStyle(handle).visibility,
          inMenu: menu.contains(document.activeElement),
        }).toEqual({ handleVisibility: 'visible', inMenu: true });
      });
    });

    it('ignores the shortcut when the editor is not editable', async () => {
      const { ref } = await mountEditor({ editable: false });

      ref.current!.getEditor().view.dom.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          ctrlKey: MODIFIER === 'Control',
          key: '>',
          keyCode: 190,
          metaKey: MODIFIER === 'Meta',
          shiftKey: true,
        })
      );

      await waitTwoFrames();

      expect(document.querySelector(MENU_SELECTOR)).toBeNull();
    });
  });

  it('deletes the block holding the caret, not another', async () => {
    const { editable, ref } = await mountEditor();
    await focusCaretAtEnd({ editable, handle: ref.current! });

    await pressBlockMenuShortcut();

    const menu = await getBlockMenu();
    await userEvent.click(getMenuItem({ label: 'Delete', menu }));

    await waitFor(() => {
      expect(getParagraphs()).toEqual(['First block']);
    });
  });

  it('returns focus and the caret to the editor on escape', async () => {
    const { editable, ref } = await mountEditor();

    await focusCaretAtEnd({ editable, handle: ref.current! });

    const editor = ref.current!.getEditor();
    const selection = editor.state.selection.from;

    await pressBlockMenuShortcut();
    await getBlockMenu();
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.querySelector(MENU_SELECTOR)).toBeNull();
    });

    await waitFor(() => {
      expect({
        focused: document.activeElement === editable,
        selection: editor.state.selection.from,
      }).toEqual({ focused: true, selection });
    });
  });
});
