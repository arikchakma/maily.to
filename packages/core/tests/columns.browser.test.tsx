import { render as renderMaily } from '@maily-to/render';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { cleanup, createRenderer, getContainerContent } from '#test-utils';

describe('<ColumnsExtension />', () => {
  const { render } = createRenderer();

  describe('creating columns', () => {
    it('creates columns and column nodes with setColumns', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(3).run();

      const columns = getContainerContent(ref.current!).at(-1);

      expect({
        children: columns?.content?.map((node) => node.type),
        columnCount: columns?.attrs?.columnCount,
        gap: columns?.attrs?.gap,
        inside: columns?.content?.[0]?.content?.map((node) => node.type),
        type: columns?.type,
      }).toEqual({
        children: ['column', 'column', 'column'],
        columnCount: 3,
        gap: 8,
        inside: ['paragraph'],
        type: 'columns',
      });
    });

    it('changes the gap with updateColumns', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(2).run();
      ref.current?.getEditor().commands.updateColumns({ gap: 24 });

      expect(getContainerContent(ref.current!).at(-1)?.attrs?.gap).toBe(24);
    });
  });

  describe('moving between columns', () => {
    it('moves between columns with Tab and Shift-Tab', async () => {
      const { ref, view } = await render();

      await userEvent.click(
        view.container.querySelector('[contenteditable="true"]')!
      );
      ref.current?.getEditor().chain().focus().setColumns(2).run();

      await userEvent.keyboard('first{Tab}second{Shift>}{Tab}{/Shift} again');

      const columns = getContainerContent(ref.current!).at(-1);

      expect(
        columns?.content?.map((node) => node.content?.[0]?.content?.[0]?.text)
      ).toEqual(['first again', 'second']);
    });

    it('marks the focused columns and column with has-focus', async () => {
      const { ref } = await render();

      const editor = ref.current!.getEditor();
      editor.chain().focus().setColumns(2).run();

      await waitFor(() => {
        const columns = document.querySelector('[data-node-type="columns"]');
        const focusedColumns = document.querySelector(
          '[data-node-type="columns"].has-focus'
        );
        const focusedColumn = document.querySelector(
          '[data-node-type="column"].has-focus'
        );

        expect({
          columns: columns !== null,
          focusedColumn: focusedColumn !== null,
          focusedColumns: focusedColumns !== null,
        }).toEqual({
          columns: true,
          focusedColumn: true,
          focusedColumns: true,
        });
      });
    });
  });

  describe('column widths', () => {
    it('sets a fixed column width with updateColumn', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(2).run();
      ref.current?.getEditor().commands.updateColumn({ width: 30 });

      expect(
        getContainerContent(ref.current!)
          .at(-1)
          ?.content?.map((column) => column.attrs?.width)
      ).toEqual([30, null]);
    });

    const PIXEL_COLUMNS =
      '<div data-node-type="columns" data-gap="0" data-column-count="2">' +
      '<div data-node-type="column" style="width:200px;max-width:200px"><p>Left</p></div>' +
      '<div data-node-type="column" style="width:12em;max-width:12em"><p>Right</p></div>' +
      '</div>';

    it('keeps the unit a pasted column width was written in', async () => {
      const { ref } = await render({ content: PIXEL_COLUMNS });

      expect(
        getContainerContent(ref.current!)
          .find((node) => node.type === 'columns')
          ?.content?.map((column) => column.attrs?.width)
      ).toEqual(['200px', '12em']);
    });

    it('writes a pasted column width back in its own unit', async () => {
      const { ref } = await render({ content: PIXEL_COLUMNS });

      const html = ref.current!.getEditorHTML();

      expect([
        /width:\s*200px;\s*max-width:\s*200px/.test(html),
        /width:\s*12em;\s*max-width:\s*12em/.test(html),
      ]).toEqual([true, true]);
    });

    it('turns a pasted width into a percentage once it is set', async () => {
      const { ref } = await render({ content: PIXEL_COLUMNS });
      const instance = ref.current!.getEditor();

      instance.chain().focus().setTextSelection(3).run();
      instance.commands.updateColumn({ width: 30 });

      expect(
        getContainerContent(ref.current!)
          .find((node) => node.type === 'columns')
          ?.content?.map((column) => column.attrs?.width)
      ).toEqual([30, '12em']);
    });

    const PASTED_COLUMNS =
      '<div data-node-type="columns" data-gap="8" data-column-count="2">' +
      '<div data-node-type="column" style="width:50%;max-width:50%;vertical-align:middle;background-color:#ff0000"><p>Left</p></div>' +
      '<div data-node-type="column" style="width:50%;max-width:50%"><p>Right</p></div>' +
      '</div>';

    it('keeps a parsed column width out of its style', async () => {
      const { ref } = await render({ content: PASTED_COLUMNS });

      const column = getContainerContent(ref.current!).find(
        (node) => node.type === 'columns'
      )?.content?.[0];

      expect({
        style: column?.attrs?.style,
        verticalAlign: column?.attrs?.verticalAlign,
        width: column?.attrs?.width,
      }).toEqual({
        style: 'background-color:#ff0000',
        verticalAlign: 'middle',
        width: 50,
      });
    });

    it('exports a parsed column at its gap-adjusted width', async () => {
      const { ref } = await render({ content: PASTED_COLUMNS });

      const columns = getContainerContent(ref.current!).find(
        (node) => node.type === 'columns'
      )!;

      const exported = await renderMaily({
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'body',
            content: [{ type: 'container', content: [columns] }],
          },
        ],
      });

      const cell = new DOMParser()
        .parseFromString(exported, 'text/html')
        .querySelector<HTMLTableCellElement>('td.tab-col-full');

      expect({
        attribute: Number.parseFloat(cell?.getAttribute('width') ?? ''),
        style: Number.parseFloat(cell?.style.width ?? ''),
      }).toEqual({
        attribute: expect.closeTo(49.342, 3),
        style: expect.closeTo(49.342, 3),
      });
    });
  });

  describe('vertical alignment', () => {
    it('lays the editor column out to match its vertical alignment', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(2).run();
      ref.current
        ?.getEditor()
        .commands.updateColumn({ verticalAlign: 'middle' });

      const column = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-editor-content] [data-node-type="column"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      expect({
        direction: column.style.flexDirection,
        display: column.style.display,
        justify: column.style.justifyContent,
      }).toEqual({ direction: 'column', display: 'flex', justify: 'center' });

      ref.current
        ?.getEditor()
        .commands.updateColumn({ verticalAlign: 'bottom' });

      await waitFor(() => {
        expect(
          document.querySelector<HTMLElement>(
            '[data-mly-editor-content] [data-node-type="column"]'
          )!.style.justifyContent
        ).toBe('flex-end');
      });
    });

    it('keeps a vertical alignment through an editor HTML round-trip', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(2).run();
      ref.current
        ?.getEditor()
        .commands.updateColumn({ verticalAlign: 'middle' });

      const editorHtml = ref.current!.getEditorHTML();

      cleanup();

      const { ref: pasted } = await render({ content: editorHtml });

      const column = getContainerContent(pasted.current!).find(
        (node) => node.type === 'columns'
      )?.content?.[0];

      expect({
        style: column?.attrs?.style,
        verticalAlign: column?.attrs?.verticalAlign,
      }).toEqual({ style: null, verticalAlign: 'middle' });
    });
  });

  describe('html round-trip', () => {
    it('keeps columns through an editor HTML round-trip', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(3).run();
      ref.current?.getEditor().commands.updateColumns({ gap: 16 });

      const before = ref.current!.getJSON();
      const editorHtml = ref.current!.getEditorHTML();

      cleanup();

      const { ref: pasted } = await render({ content: editorHtml });

      expect(pasted.current!.getJSON()).toEqual(before);
    });

    it('imports exported column markup as nested tables', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setColumns(2).run();
      const columns = getContainerContent(ref.current!).at(-1)!;

      cleanup();

      const exported = await renderMaily({
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'body',
            content: [{ type: 'container', content: [columns] }],
          },
        ],
      });

      const { ref: reimported } = await render({ content: exported });

      const [table] = getContainerContent(reimported.current!);
      const inner = table?.content?.[0]?.content?.[0]?.content?.[0];

      expect({
        cells: inner?.content?.[0]?.content?.length,
        inner: inner?.type,
        outer: table?.type,
      }).toEqual({ cells: 3, inner: 'table', outer: 'table' });
    });
  });
});
