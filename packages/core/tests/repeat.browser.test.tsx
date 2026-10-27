import { render as renderMaily } from '@maily-to/render';
import type { RenderResult } from '@testing-library/react';
import { waitFor, within } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, EMPTY_DOCUMENT, getDocument } from '#test-utils';
import { RepeatBubbleMenu } from '~/index';
import type { Editor } from '~/index';

function getRepeatDocument(each: string) {
  return getDocument([
    {
      type: 'repeat',
      attrs: { each },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'variable', attrs: { id: 'name' } }],
        },
      ],
    },
  ]);
}

const DOCUMENT = getRepeatDocument('{{items}}');

function getRepeatNode(handle: Editor.Root.Handle) {
  let found: JSONContent | undefined;
  handle.getEditor().state.doc.descendants((node) => {
    if (node.type.name === 'repeat') {
      found = node.toJSON() as JSONContent;
    }
  });

  return found;
}

function selectRepeat(handle: Editor.Root.Handle) {
  const instance = handle.getEditor();
  let position: number | null = null;

  instance.state.doc.descendants((node, pos) => {
    if (node.type.name === 'repeat' && position === null) {
      position = pos;
    }
  });

  instance.chain().focus().setNodeSelection(position!).run();
}

async function openEachField(view: RenderResult) {
  const field = await waitFor(() => {
    const found = view.baseElement.querySelector<HTMLElement>(
      '[data-mly-variable-only-editor] [contenteditable="true"]'
    );
    expect(found).not.toBeNull();

    return found!;
  });

  await userEvent.click(field);

  return field;
}

describe('<RepeatExtension />', () => {
  const { render } = createRenderer();

  const mountEditor = async (content: JSONContent | string = DOCUMENT) => {
    return render({ children: <RepeatBubbleMenu />, content });
  };

  it('inserts a repeat with a paragraph to write into', async () => {
    const { ref } = await mountEditor(EMPTY_DOCUMENT);

    ref.current!.getEditor().chain().focus().setRepeat().run();

    const repeat = getRepeatNode(ref.current!);

    expect({
      each: repeat?.attrs?.each,
      content: repeat?.content?.map((child) => {
        return child.type;
      }),
    }).toEqual({ each: '{{items}}', content: ['paragraph'] });
  });

  describe('nested blocks', () => {
    it('holds its blocks as its own children', async () => {
      const { view } = await mountEditor();

      expect(
        view.container.querySelector('[data-node-type="repeat"] > p')
      ).not.toBeNull();
    });

    it('spaces the blocks inside a repeat the way the theme spaces a container', async () => {
      const { view } = await render({
        content: getDocument([
          {
            type: 'repeat',
            attrs: { each: '{{items}}' },
            content: [
              {
                type: 'heading',
                attrs: { level: 2 },
                content: [{ type: 'text', text: 'Title' }],
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Body' }],
              },
            ],
          },
        ]),
        theme: true,
      });

      expect(
        getComputedStyle(within(view.container).getByText('Title')).marginBottom
      ).toBe('12px');
    });
  });

  describe('the each expression', () => {
    it('writes the chosen list into the repeat attributes', async () => {
      const { ref, view } = await mountEditor();

      selectRepeat(ref.current!);

      const field = await openEachField(view);
      await userEvent.clear(field);
      await userEvent.keyboard('{{{{people');

      await waitFor(() => {
        expect(document.querySelector('[data-mly-suggestion]')).not.toBeNull();
      });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getRepeatNode(ref.current!)?.attrs?.each).toBe('{{people}}');
      });

      const html = await renderMaily(ref.current!.getJSON(), {
        variables: { people: [{ name: 'Ada' }, { name: 'Grace' }] },
      });

      expect(
        [
          ...new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelectorAll('p'),
        ].map((paragraph) => {
          return paragraph.textContent;
        })
      ).toEqual(['Ada', 'Grace']);
    });

    it('takes only variables, not the text typed around them', async () => {
      const { ref, view } = await mountEditor();

      selectRepeat(ref.current!);

      const field = await openEachField(view);
      await userEvent.clear(field);
      await userEvent.keyboard('plain text');

      expect(getRepeatNode(ref.current!)?.attrs?.each).toBe('');
    });

    it('keeps the trigger when the field is emptied', async () => {
      const { ref, view } = await mountEditor();

      selectRepeat(ref.current!);

      const field = await openEachField(view);
      await userEvent.clear(field);

      await waitFor(() => {
        expect(field.textContent).toBe('{{');
      });
    });
  });

  describe('rendering', () => {
    it('survives a round trip through the editor HTML', async () => {
      const { ref } = await mountEditor(getRepeatDocument('{{people}}'));
      const html = ref.current!.getEditor().getHTML();

      const { ref: reopened } = await mountEditor(html);

      expect(getRepeatNode(reopened.current!)?.attrs?.each).toBe('{{people}}');
    });

    it('renders one copy of the content for every item', async () => {
      const { ref } = await mountEditor();

      const html = await renderMaily(ref.current!.getJSON(), {
        variables: { items: [{ name: 'Ada' }, { name: 'Grace' }] },
      });

      expect(html).toContain('Ada');
      expect(html).toContain('Grace');
    });
  });
});
