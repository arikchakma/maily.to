import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { ButtonBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Outside the button' }],
  },
  {
    type: 'button',
    attrs: {
      align: 'center',
      kind: 'tight',
      style: 'background-color:#000000;color:#ffffff;padding:10px 32px',
      url: 'https://maily.to',
    },
    content: [{ type: 'text', text: 'Click me' }],
  },
]);

function selectInsideButton(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'button') {
      position = pos + 1;
    }
  });

  editor.chain().focus().setTextSelection(position!).run();
}

async function findBubbleButton(label: string) {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      `[data-mly-bubble-button][aria-label="${label}"]`
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

async function findUnitField(label: string) {
  return waitFor(() => {
    const found = document.querySelector<HTMLInputElement>(
      `[data-mly-unit-field] input[aria-label="${label}"]`
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

function getButtonNode(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'button';
  });
}

describe('<ButtonBubbleMenu />', () => {
  const { render } = createRenderer();

  const renderMenu = () => {
    return render({ children: <ButtonBubbleMenu />, content: DOCUMENT });
  };

  it('opens with the button controls once the cursor is inside', async () => {
    const { ref } = await renderMenu();

    selectInsideButton(ref.current!);

    await findBubbleButton('Alignment');
    await findBubbleButton('Link');
    await findBubbleButton('Full Width');
    await findBubbleButton('Background Color');
    await findBubbleButton('Text Color');
  });

  it('writes a new url into the button', async () => {
    const { ref } = await renderMenu();

    selectInsideButton(ref.current!);

    await userEvent.click(await findBubbleButton('Link'));

    const field = await waitFor(() => {
      const found = document.querySelector<HTMLElement>(
        '[data-mly-skeleton-editor] [contenteditable="true"]'
      );
      expect(found).not.toBeNull();
      return found!;
    });

    await userEvent.tripleClick(field);
    await userEvent.keyboard('https://example.com{Enter}');

    await waitFor(() => {
      expect(getButtonNode(ref.current!)?.attrs?.url).toBe(
        'https://example.com'
      );
    });
  });

  describe('layout', () => {
    it('switches the button between tight and full width', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Full Width'));

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.kind).toBe('full-width');
      });

      await userEvent.click(await findBubbleButton('Tight'));

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.kind).toBe('tight');
      });
    });

    it('writes the chosen alignment into the button attributes', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Alignment'));
      await userEvent.click(await findBubbleButton('Align Right'));

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.align).toBe('right');
      });
    });
  });

  describe('style', () => {
    it('writes the chosen text colour into the button style', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Text Color'));
      await userEvent.click(await findBubbleButton('Red Text'));

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.style).toContain(
          'color:#C4554D'
        );
      });
    });

    it('writes a border radius through the border config', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Button Style'));
      await userEvent.click(
        await waitFor(() => {
          const found = document.querySelector<HTMLElement>(
            '[data-mly-style-config-link]'
          );
          expect(found).not.toBeNull();
          return found!;
        })
      );

      const radius = await findUnitField('Radius');

      await userEvent.tripleClick(radius);
      await userEvent.keyboard('4{Enter}');

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.style).toContain(
          'border-radius:4px'
        );
      });
    });
  });

  describe('padding', () => {
    it('writes padding through the style popover', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Button Style'));

      const padding = await findUnitField('Padding');

      expect(padding.value).toBe('Mixed');

      await userEvent.tripleClick(padding);
      await userEvent.keyboard('12{Enter}');

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.style).toContain(
          'padding:12px'
        );
      });
    });

    it('shows a dragged side in the expanded padding field before it commits', async () => {
      const { ref } = await renderMenu();

      selectInsideButton(ref.current!);

      await userEvent.click(await findBubbleButton('Button Style'));

      const side = await findUnitField('Padding top');

      expect(side.value).toBe('10px');

      const dragArea = side.previousElementSibling as HTMLElement;
      const box = dragArea.getBoundingClientRect();
      const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

      dragArea.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientX: start.x,
          clientY: start.y,
          pointerId: 1,
        })
      );
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: start.x + 40,
          clientY: start.y,
          movementX: 40,
          pointerId: 1,
        })
      );

      await waitFor(() => {
        expect(side.value).not.toBe('10px');
      });

      expect(getButtonNode(ref.current!)?.attrs?.style).toContain(
        'padding:10px 32px'
      );

      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          clientX: start.x + 40,
          clientY: start.y,
          pointerId: 1,
        })
      );

      await waitFor(() => {
        expect(getButtonNode(ref.current!)?.attrs?.style).not.toContain(
          'padding:10px 32px'
        );
      });
    });
  });
});
