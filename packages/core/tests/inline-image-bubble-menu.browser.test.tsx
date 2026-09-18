import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { InlineImageBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [
      { type: 'text', text: 'Rated ' },
      {
        type: 'inlineImage',
        attrs: {
          alt: 'Star',
          height: 20,
          src: 'https://maily.to/brand/star.png',
          width: 20,
        },
      },
    ],
  },
]);

function selectInlineImage(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'inlineImage') {
      position = pos;
    }
  });

  editor.commands.setNodeSelection(position!);
}

function getInlineImage(handle: Editor.Root.Handle) {
  return getContainerContent(handle)
    .at(0)
    ?.content?.find((node) => {
      return node.type === 'inlineImage';
    });
}

async function findSizeField() {
  return waitFor(() => {
    const found = document.querySelector<HTMLInputElement>(
      '[data-mly-unit-field] input[aria-label="Size"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

describe('<InlineImageBubbleMenu />', () => {
  const { render } = createRenderer();

  it('opens with the inline image controls once it is selected', async () => {
    const { ref } = await render({
      children: <InlineImageBubbleMenu />,
      content: DOCUMENT,
    });

    selectInlineImage(ref.current!);

    const size = await findSizeField();

    expect(size.value).toBe('20px');
    expect(
      document.querySelector(
        '[data-mly-bubble-button][aria-label="Source URL"]'
      )
    ).not.toBeNull();
  });

  describe('size', () => {
    it('commits a new size to both dimensions and keeps the menu open', async () => {
      const { ref } = await render({
        children: <InlineImageBubbleMenu />,
        content: DOCUMENT,
      });

      selectInlineImage(ref.current!);

      const field = await findSizeField();

      await userEvent.tripleClick(field);
      await userEvent.keyboard('32{Enter}');

      await waitFor(() => {
        const inlineImage = getInlineImage(ref.current!);
        expect(inlineImage?.attrs?.width).toBe(32);
        expect(inlineImage?.attrs?.height).toBe(32);
      });

      expect(document.querySelector('[data-mly-bubble-menu]')).not.toBeNull();
    });
  });
});
