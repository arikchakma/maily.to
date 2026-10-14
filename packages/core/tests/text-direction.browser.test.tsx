import { DEFAULT_TEXT_DIRECTION } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { Editor } from '~/index';

const PARAGRAPH_TEXT = 'Read me in either direction';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: PARAGRAPH_TEXT }],
  },
  {
    type: 'footer',
    content: [{ type: 'text', text: 'Unsubscribe' }],
  },
]);

function getParagraphDocument(attrs: JSONContent['attrs']) {
  return getDocument([
    {
      type: 'paragraph',
      attrs,
      content: [{ type: 'text', text: PARAGRAPH_TEXT }],
    },
  ]);
}

function getBlockSelector(tag: string) {
  return `[contenteditable="true"] [data-node-type="container"] > ${tag}`;
}

async function openDragMenu(selector: string) {
  await userEvent.hover(document.querySelector<HTMLElement>(selector)!);

  const trigger = await waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-drag-context-trigger]'
    );
    expect(found).not.toBeNull();
    return found!;
  });

  await userEvent.click(trigger);

  return waitFor(() => {
    const found = [
      ...document.querySelectorAll<HTMLButtonElement>(
        '[data-mly-drag-context-item]'
      ),
    ].find((item) => {
      return item.textContent?.startsWith('Text Direction');
    });
    expect(found).not.toBeUndefined();
    return found!;
  });
}

async function openDirectionPanel() {
  await userEvent.click(await openDragMenu(getBlockSelector('p')));

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-text-direction-config]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

async function pickDirection(label: string) {
  const option = await waitFor(() => {
    const found = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-mly-text-direction-option]'
      ),
    ].find((candidate) => {
      return candidate.textContent?.startsWith(label);
    });
    expect(found).not.toBeUndefined();
    return found!;
  });

  await userEvent.click(option);
}

function getParagraph(handle: Editor.Root.Handle) {
  const paragraph = getContainerContent(handle)[0];

  return {
    dir: paragraph?.attrs?.dir ?? null,
    style: paragraph?.attrs?.style ?? '',
  };
}

describe('<TextDirectionConfig />', () => {
  const { render } = createRenderer();

  const mountEditor = async (content = DOCUMENT) => {
    return render({
      children: <Editor.DragContextHandle />,
      content,
      styled: true,
      theme: true,
      wrapper: { padding: 64 },
    });
  };

  describe('picking a direction', () => {
    it('writes the direction and follows it with the alignment', async () => {
      const { ref } = await mountEditor();

      await openDirectionPanel();
      await pickDirection('Right to Left');

      await waitFor(() => {
        expect(getParagraph(ref.current!)).toEqual({
          dir: 'rtl',
          style: 'text-align:right',
        });
      });
    });

    it('clears the direction when the block goes back to auto', async () => {
      const { ref } = await mountEditor();

      await openDirectionPanel();
      await pickDirection('Right to Left');

      await waitFor(() => {
        expect(getParagraph(ref.current!).dir).toBe('rtl');
      });

      await pickDirection('Auto');

      await waitFor(() => {
        expect(getParagraph(ref.current!)).toEqual({
          dir: DEFAULT_TEXT_DIRECTION,
          style: 'text-align:left',
        });
      });
    });

    it('leaves a centred block centred', async () => {
      const { ref } = await mountEditor(
        getParagraphDocument({ style: 'text-align:center' })
      );

      await openDirectionPanel();
      await pickDirection('Right to Left');

      await waitFor(() => {
        expect(getParagraph(ref.current!)).toEqual({
          dir: 'rtl',
          style: 'text-align:center',
        });
      });
    });
  });

  it('offers the panel only for a block that takes a direction', async () => {
    await mountEditor();

    expect((await openDragMenu(getBlockSelector('p'))).disabled).toBe(false);

    await userEvent.keyboard('{Escape}');

    expect((await openDragMenu(getBlockSelector('small'))).disabled).toBe(true);
  });

  it('marks the direction the block already carries', async () => {
    await mountEditor(getParagraphDocument({ dir: 'rtl' }));

    const panel = await openDirectionPanel();

    expect(
      [
        ...panel.querySelectorAll<HTMLElement>(
          '[data-mly-text-direction-option]'
        ),
      ]
        .filter((option) => {
          return option.hasAttribute('data-active');
        })
        .map((option) => {
          return option.textContent;
        })
    ).toEqual(['Right to Left']);
  });
});
