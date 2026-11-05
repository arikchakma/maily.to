import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { ColumnsBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Outside the columns' }],
  },
  {
    type: 'columns',
    attrs: { columnCount: 2, gap: 8 },
    content: [
      {
        type: 'column',
        attrs: { verticalAlign: 'top', width: null },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Left' }],
          },
        ],
      },
      {
        type: 'column',
        attrs: { verticalAlign: 'top', width: null },
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Right' }],
          },
        ],
      },
    ],
  },
]);

function selectInsideColumns(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'columns' && position === null) {
      position = pos + 3;
    }
  });

  editor.chain().focus().setTextSelection(position!).run();
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

function getColumns(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'columns';
  });
}

async function findGapField() {
  return waitFor(() => {
    const found = document.querySelector<HTMLInputElement>(
      '[data-mly-unit-field] input[aria-label="Gap"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

async function findGapDragArea() {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-unit-field] > span'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

async function openColumnSettings() {
  await userEvent.click(await findButton('Column Settings'));

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-popover][data-variant="columns-width"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

function getCountButton(label: string) {
  return [
    ...document.querySelectorAll<HTMLElement>(
      '[data-mly-columns-count-button]'
    ),
  ].find((button) => {
    return button.textContent === label;
  })!;
}

function getWidthField(label: string) {
  return document.querySelector<HTMLInputElement>(
    `[data-mly-column-width-field] input[aria-label="${label} Column Width"]`
  );
}

describe('<ColumnsBubbleMenu />', () => {
  const { render } = createRenderer();

  it('opens with the columns controls once the cursor is inside', async () => {
    const { ref } = await render({
      children: <ColumnsBubbleMenu />,
      content: DOCUMENT,
    });

    selectInsideColumns(ref.current!);

    await findButton('Align Top');
    await findButton('Align Middle');
    await findButton('Align Bottom');
    await findButton('Delete Columns');

    expect(
      document.querySelector<HTMLInputElement>(
        '[data-mly-unit-field] input[aria-label="Gap"]'
      )?.value
    ).toBe('8px');
  });

  it('writes the chosen vertical alignment into the active column', async () => {
    const { ref } = await render({
      children: <ColumnsBubbleMenu />,
      content: DOCUMENT,
    });

    selectInsideColumns(ref.current!);

    await userEvent.click(await findButton('Align Middle'));

    await waitFor(() => {
      expect(getColumns(ref.current!)?.content?.[0]?.attrs?.verticalAlign).toBe(
        'middle'
      );
    });
  });

  it('deletes the columns node', async () => {
    const { ref } = await render({
      children: <ColumnsBubbleMenu />,
      content: DOCUMENT,
    });

    selectInsideColumns(ref.current!);

    await userEvent.click(await findButton('Delete Columns'));

    await waitFor(() => {
      expect(getColumns(ref.current!)).toBeUndefined();
    });
  });

  describe('gap', () => {
    it('commits a new gap to the columns node', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);

      const field = await findGapField();

      await userEvent.tripleClick(field);
      await userEvent.keyboard('24{Enter}');

      await waitFor(() => {
        expect(getColumns(ref.current!)?.attrs?.gap).toBe(24);
      });
    });

    it('applies the gap to the columns element', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);

      const columns = document.querySelector<HTMLElement>(
        '[data-node-type="columns"]'
      );
      expect(columns).not.toBeNull();
      expect(getComputedStyle(columns!).columnGap).toBe('8px');

      ref.current?.getEditor().chain().updateColumns({ gap: 24 }).run();

      await waitFor(() => {
        expect(
          getComputedStyle(
            document.querySelector<HTMLElement>('[data-node-type="columns"]')!
          ).columnGap
        ).toBe('24px');
      });
    });

    it('shows a dragged gap in the field, then commits it to the columns node', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);

      const field = await findGapField();

      const dragArea = await findGapDragArea();
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
      document.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientX: start.x + 40,
          clientY: start.y,
          movementX: 40,
          pointerId: 1,
        })
      );

      await waitFor(() => {
        expect(field.value).not.toBe('8px');
      });

      expect(getColumns(ref.current!)?.attrs?.gap).toBe(8);

      document.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          clientX: start.x + 40,
          clientY: start.y,
          pointerId: 1,
        })
      );

      await waitFor(() => {
        expect(getColumns(ref.current!)?.attrs?.gap).toBeGreaterThan(8);
      });
    });
  });

  describe('column count', () => {
    it('adds a third column', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);
      await openColumnSettings();

      await userEvent.click(getCountButton('3 Columns'));

      await waitFor(() => {
        expect(getColumns(ref.current!)?.content?.length).toBe(3);
      });

      expect(getColumns(ref.current!)?.attrs?.columnCount).toBe(3);
      expect(getColumns(ref.current!)?.content?.[0]?.content?.[0]).toEqual(
        expect.objectContaining({
          content: [{ text: 'Left', type: 'text' }],
        })
      );
    });

    it('removes the last column', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);
      await openColumnSettings();

      await userEvent.click(getCountButton('3 Columns'));
      await waitFor(() => {
        expect(getColumns(ref.current!)?.content?.length).toBe(3);
      });

      await userEvent.click(getCountButton('2 Columns'));

      await waitFor(() => {
        expect(getColumns(ref.current!)?.content?.length).toBe(2);
      });

      expect(getColumns(ref.current!)?.attrs?.columnCount).toBe(2);
    });
  });

  describe('column widths', () => {
    it('shows a width field per column, auto until one is set', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);
      await openColumnSettings();

      expect(getWidthField('Left')?.value).toBe('auto');
      expect(getWidthField('Right')?.value).toBe('auto');
      expect(getWidthField('Middle')).toBeNull();
    });

    it('commits a width to the matching column only and keeps its content', async () => {
      const { ref } = await render({
        children: <ColumnsBubbleMenu />,
        content: DOCUMENT,
      });

      selectInsideColumns(ref.current!);
      await openColumnSettings();

      await userEvent.tripleClick(getWidthField('Left')!);
      await userEvent.keyboard('40{Enter}');

      await waitFor(() => {
        expect(getColumns(ref.current!)?.content?.[0]?.attrs?.width).toBe(40);
      });

      expect(getColumns(ref.current!)?.content?.[1]?.attrs?.width).toBeNull();

      await userEvent.tripleClick(getWidthField('Right')!);
      await userEvent.keyboard('30{Enter}');

      await waitFor(() => {
        expect(getColumns(ref.current!)?.content?.[1]?.attrs?.width).toBe(30);
      });

      expect({
        left: getColumns(ref.current!)?.content?.[0]?.content?.[0],
        right: getColumns(ref.current!)?.content?.[1]?.content?.[0],
      }).toEqual({
        left: expect.objectContaining({
          content: [{ text: 'Left', type: 'text' }],
        }),
        right: expect.objectContaining({
          content: [{ text: 'Right', type: 'text' }],
        }),
      });
    });
  });
});
