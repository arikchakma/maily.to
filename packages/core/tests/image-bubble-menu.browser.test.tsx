import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { ImageBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const IMAGE_SRC = 'https://maily.to/brand/logo.png';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Above the image' }],
  },
  {
    type: 'image',
    attrs: { align: 'left', alt: 'Logo', src: IMAGE_SRC, width: '100%' },
  },
]);

function selectImage(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') {
      position = pos;
    }
  });

  editor.commands.setNodeSelection(position!);
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

function getImage(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'image';
  });
}

describe('<ImageBubbleMenu />', () => {
  const { render } = createRenderer();

  it('opens with the image controls once the image is selected', async () => {
    const { ref } = await render({
      children: <ImageBubbleMenu />,
      content: DOCUMENT,
    });

    selectImage(ref.current!);

    await findButton('Alignment');
    await findButton('External Link');
    await findButton('Source URL');
    await findButton('Image Metadata');
  });

  it('writes the chosen alignment into the image attributes', async () => {
    const { ref } = await render({
      children: <ImageBubbleMenu />,
      content: DOCUMENT,
    });

    selectImage(ref.current!);

    await userEvent.click(await findButton('Alignment'));
    await userEvent.click(await findButton('Align Center'));

    await waitFor(() => {
      expect(getImage(ref.current!)?.attrs?.align).toBe('center');
    });
  });

  it('writes the alt text through the metadata popover', async () => {
    const { ref } = await render({
      children: <ImageBubbleMenu />,
      content: DOCUMENT,
    });

    selectImage(ref.current!);

    await userEvent.click(await findButton('Image Metadata'));

    const field = await waitFor(() => {
      const found = [
        ...document.querySelectorAll<HTMLInputElement>(
          '[data-mly-field-input]'
        ),
      ].find((input) => {
        return input.value === 'Logo';
      });
      expect(found).not.toBeUndefined();
      return found!;
    });

    await userEvent.tripleClick(field);
    await userEvent.keyboard('Maily logo');

    await waitFor(() => {
      expect(getImage(ref.current!)?.attrs?.alt).toBe('Maily logo');
    });
  });
});
