import { parseInlineStyles } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { Toolbar } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Toolbar target' }],
  },
]);

function getParagraph(handle: Editor.Root.Handle) {
  let found: JSONContent | undefined;
  handle.getEditor().state.doc.descendants((node) => {
    if (node.type.name === 'paragraph') {
      found = node.toJSON() as JSONContent;
    }
  });

  return found;
}

function selectAll(handle: Editor.Root.Handle) {
  handle.getEditor().chain().focus().selectAll().run();
}

async function findButton(label: string) {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      `[data-mly-bubble-button][aria-label="${label}"]`
    );
    expect(found).not.toBeNull();

    return found!;
  });
}

describe('<Toolbar />', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({
      content: DOCUMENT,
      toolbar: (
        <Toolbar.Root>
          <Toolbar.CommonActions />
        </Toolbar.Root>
      ),
    });
  };

  it('groups the common actions inside one toolbar', async () => {
    const { view } = await mountEditor();
    const toolbar = view.container.querySelector('[data-mly-toolbar]');

    expect({
      groups: toolbar?.querySelectorAll('[data-mly-toolbar-group]').length,
      labels: [...(toolbar?.querySelectorAll('[data-mly-bubble-button]') ?? [])]
        .map((button) => {
          return button.getAttribute('aria-label');
        })
        .filter((label) => {
          return label !== null;
        }),
    }).toEqual({
      groups: 3,
      labels: [
        'Undo',
        'Redo',
        'Bold',
        'Italic',
        'Underline',
        'Strikethrough',
        'Code',
        'Alignment',
        'Direction',
      ],
    });
  });

  describe('marks', () => {
    it('applies a mark to the selection and shows it as active', async () => {
      const { ref } = await mountEditor();
      const bold = await findButton('Bold');

      expect(bold.getAttribute('data-active')).toBeNull();

      selectAll(ref.current!);
      await userEvent.click(bold);

      await waitFor(() => {
        expect(
          getParagraph(ref.current!)?.content?.[0]?.marks?.map((mark) => {
            return mark.type;
          })
        ).toEqual(['bold']);
      });

      expect(bold.getAttribute('data-active')).toBe('');
    });
  });

  describe('undo and redo', () => {
    it('disables redo until a change has been undone', async () => {
      const { ref } = await mountEditor();
      const redo = await findButton('Redo');

      expect(redo.getAttribute('aria-disabled')).toBe('true');

      selectAll(ref.current!);
      await userEvent.click(await findButton('Bold'));
      await userEvent.click(await findButton('Undo'));

      await waitFor(() => {
        expect(redo.getAttribute('aria-disabled')).toBe('false');
      });
    });

    it('undoes the last change from the toolbar', async () => {
      const { ref } = await mountEditor();

      selectAll(ref.current!);
      await userEvent.click(await findButton('Bold'));

      await waitFor(() => {
        expect(getParagraph(ref.current!)?.content?.[0]?.marks).toBeDefined();
      });

      await userEvent.click(await findButton('Undo'));

      await waitFor(() => {
        expect(getParagraph(ref.current!)?.content?.[0]?.marks).toBeUndefined();
      });
    });
  });

  it('writes the chosen alignment into the active block style', async () => {
    const { ref } = await mountEditor();

    selectAll(ref.current!);
    await userEvent.click(await findButton('Alignment'));
    await userEvent.click(await findButton('Align Center'));

    await waitFor(() => {
      const style = getParagraph(ref.current!)?.attrs?.style as string;
      expect(parseInlineStyles(style ?? '').textAlign).toBe('center');
    });
  });

  it('changes the editor text direction from the toolbar', async () => {
    const { view } = await mountEditor();
    const getEditable = () => {
      return view.container.querySelector('[contenteditable="true"]');
    };

    expect(getEditable()?.getAttribute('dir')).toBe('auto');

    await userEvent.click(await findButton('Direction'));
    await userEvent.click(await findButton('Right to Left'));

    await waitFor(() => {
      expect(getEditable()?.getAttribute('dir')).toBe('rtl');
    });
  });

  describe('focus management', () => {
    it('takes one tab stop and moves between actions with arrows', async () => {
      const { view } = await mountEditor();

      const getButtons = () => {
        return [
          ...view.container.querySelectorAll<HTMLButtonElement>(
            '[data-mly-toolbar] button'
          ),
        ];
      };

      expect(
        getButtons().filter((button) => {
          return button.tabIndex === 0;
        })
      ).toHaveLength(1);

      await userEvent.tab();

      expect(document.activeElement).toBe(getButtons()[0]);

      await userEvent.keyboard('{ArrowRight}');

      expect(document.activeElement).toBe(getButtons()[1]);

      await userEvent.keyboard('{ArrowLeft}');

      expect(document.activeElement).toBe(getButtons()[0]);

      await userEvent.tab();

      expect(
        view.container
          .querySelector('[data-mly-toolbar]')
          ?.contains(document.activeElement)
      ).toBe(false);
    });

    it('leaves focus alone when a pointer opens a popover', async () => {
      await mountEditor();

      await userEvent.click(await findButton('Alignment'));
      await findButton('Align Left');

      expect({
        focused: document.activeElement?.getAttribute('aria-label'),
        tooltips: document.querySelectorAll('[data-mly-tooltip]').length,
      }).toEqual({ focused: null, tooltips: 0 });
    });
  });
});
