import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { SectionBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Outside the section' }],
  },
  {
    type: 'section',
    attrs: { style: 'background-color:#f7f7f7' },
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Inside the section' }],
      },
    ],
  },
]);

function selectOutsideSection(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (position === null && node.type.name === 'paragraph') {
      position = pos + 1;
    }
  });

  editor.commands.setTextSelection(position!);
}

function selectInsideSection(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'section') {
      position = pos + 2;
    }
  });

  editor.commands.setTextSelection(position!);
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

function getSection(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'section';
  });
}

describe('<SectionBubbleMenu />', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({ children: <SectionBubbleMenu />, content: DOCUMENT });
  };

  describe('visibility', () => {
    it('stays hidden while the cursor is outside a section', async () => {
      const { ref } = await mountEditor();

      selectOutsideSection(ref.current!);

      await waitFor(() => {
        expect(document.querySelector('[data-mly-bubble-menu]')).toBeNull();
      });
    });

    it('opens with the section controls once the cursor is inside', async () => {
      const { ref } = await mountEditor();

      selectInsideSection(ref.current!);

      await findButton('Alignment');
      await findButton('Background Color');
      await findButton('Delete Section');
    });
  });

  describe('styling', () => {
    it('writes the chosen alignment into the section style', async () => {
      const { ref } = await mountEditor();

      selectInsideSection(ref.current!);

      await userEvent.click(await findButton('Alignment'));
      await userEvent.click(await findButton('Align Center'));

      await waitFor(() => {
        expect(getSection(ref.current!)?.attrs?.style).toContain(
          'text-align:center'
        );
      });
    });

    it('writes the chosen background colour into the section style', async () => {
      const { ref } = await mountEditor();

      selectInsideSection(ref.current!);

      await userEvent.click(await findButton('Background Color'));
      await userEvent.click(await findButton('Blue Background'));

      await waitFor(() => {
        expect(getSection(ref.current!)?.attrs?.style).toContain(
          'background-color:#E9F3F7'
        );
      });
    });
  });

  it('deletes the section', async () => {
    const { ref } = await mountEditor();

    selectInsideSection(ref.current!);

    await userEvent.click(await findButton('Delete Section'));

    await waitFor(() => {
      expect(getSection(ref.current!)).toBeUndefined();
    });
  });
});
