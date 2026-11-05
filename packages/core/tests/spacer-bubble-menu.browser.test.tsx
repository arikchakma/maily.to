import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { SpacerBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Above the spacer' }],
  },
  { type: 'spacer', attrs: { height: 24 } },
]);

function getSpacer(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'spacer';
  });
}

function selectSpacer(handle: Editor.Root.Handle) {
  const instance = handle.getEditor();
  let position: number | null = null;

  instance.state.doc.descendants((node, pos) => {
    if (node.type.name === 'spacer') {
      position = pos;
    }
  });

  instance.chain().focus().setNodeSelection(position!).run();
}

async function findHeightField() {
  return waitFor(() => {
    const found = document.querySelector<HTMLInputElement>(
      '[data-mly-unit-field] input[aria-label="Height"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

describe('<SpacerBubbleMenu />', () => {
  const { render } = createRenderer();

  const renderMenu = () => {
    return render({ children: <SpacerBubbleMenu />, content: DOCUMENT });
  };

  it('stays hidden while the spacer is not selected', async () => {
    await render({
      caret: 'start',
      children: <SpacerBubbleMenu />,
      content: DOCUMENT,
    });

    expect(document.querySelector('[data-mly-bubble-menu]')).toBeNull();
  });

  it('sets the height from a preset', async () => {
    const { ref } = await renderMenu();

    selectSpacer(ref.current!);

    const trigger = await waitFor(() => {
      const found = document.querySelector<HTMLElement>(
        '[data-mly-select-trigger][aria-label="Height presets"]'
      );
      expect(found).not.toBeNull();
      return found!;
    });

    await userEvent.click(trigger);

    const medium = await waitFor(() => {
      const found = [
        ...document.querySelectorAll<HTMLElement>('[data-mly-select-item]'),
      ].find((item) => {
        return item.textContent?.startsWith('Medium');
      });
      expect(found).not.toBeUndefined();
      return found!;
    });

    await userEvent.click(medium);

    await waitFor(() => {
      expect(getSpacer(ref.current!)?.attrs?.height).toBe(16);
    });

    expect(
      document.querySelector<HTMLInputElement>(
        '[data-mly-unit-field] input[aria-label="Height"]'
      )?.value
    ).toBe('MD');
  });

  describe('height', () => {
    it('shows the current spacer height once the spacer is selected', async () => {
      const { ref } = await renderMenu();

      selectSpacer(ref.current!);

      const field = await findHeightField();

      expect(field.value).toBe('24px');
    });

    it('commits a new height to the spacer node', async () => {
      const { ref } = await renderMenu();

      selectSpacer(ref.current!);

      const field = await findHeightField();

      await userEvent.tripleClick(field);
      await userEvent.keyboard('40');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getSpacer(ref.current!)?.attrs?.height).toBe(40);
      });
    });

    it('shows the dragged height in the field before it is committed', async () => {
      const { ref } = await renderMenu();

      selectSpacer(ref.current!);

      const field = await findHeightField();

      const dragArea = document.querySelector<HTMLElement>(
        '[data-mly-unit-field] > span'
      )!;
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
        expect(field.value).not.toBe('24px');
      });

      expect(getSpacer(ref.current!)?.attrs?.height).toBe(24);

      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          clientX: start.x + 40,
          clientY: start.y,
          pointerId: 1,
        })
      );

      await waitFor(() => {
        expect(getSpacer(ref.current!)?.attrs?.height).toBeGreaterThan(24);
      });
    });
  });
});
