import { render as renderMaily } from '@maily-to/render';
import type { AnyMailyNode } from '@maily-to/shared';
import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';

const SPANNING_TABLE_HTML = `<table role="presentation"><tbody>
  <tr><td colspan="2" style="padding:12px;background-color:#f7f7f7"><p>Spanning</p></td></tr>
  <tr><td><p>Left</p></td><td><p>Right</p></td></tr>
</tbody></table>`;

function getExportedContent(html: string) {
  return new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector('body > table > tbody > tr > td > table > tbody > tr > td');
}

function getStyle(node: AnyMailyNode | undefined) {
  const style = node?.attrs?.style;

  return parseInlineStyles(typeof style === 'string' ? style : '');
}

describe('<TableExtension />', () => {
  const { render } = createRenderer();

  describe('inserting a table', () => {
    it('inserts a one-by-one table and exports it with the email-safe zero attributes', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .insertTable({ cols: 1, rows: 1, withHeaderRow: false })
        .run();

      const json = ref.current!.getJSON();
      const table = getContainerContent(ref.current!).at(-1);
      const row = table?.content?.[0];
      const cell = row?.content?.[0];

      expect({
        cell: cell?.type,
        cellContent: cell?.content?.map((node) => node.type),
        row: row?.type,
        table: table?.type,
      }).toEqual({
        cell: 'tableCell',
        cellContent: ['paragraph'],
        row: 'tableRow',
        table: 'table',
      });

      const exported = getExportedContent(await renderMaily(json));

      expect(
        exported?.querySelectorAll('table[role="presentation"] tbody tr td')
          .length
      ).toBe(1);

      const exportedTable = exported?.querySelector('table');

      expect({
        border: exportedTable?.getAttribute('border'),
        cellpadding: exportedTable?.getAttribute('cellpadding'),
        cellspacing: exportedTable?.getAttribute('cellspacing'),
      }).toEqual({ border: '0', cellpadding: '0', cellspacing: '0' });
    });

    it('inserts a table with a header row', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .insertTable({ cols: 2, rows: 2, withHeaderRow: true })
        .run();

      const rows = getContainerContent(ref.current!).at(-1)?.content ?? [];

      expect(rows.map((row) => row.content?.map((cell) => cell.type))).toEqual([
        ['tableHeader', 'tableHeader'],
        ['tableCell', 'tableCell'],
      ]);
    });
  });

  describe('cell styles', () => {
    it('round-trips a cell style and its spans through JSON and export', async () => {
      const { ref } = await render({ content: SPANNING_TABLE_HTML });

      const json = ref.current!.getJSON();
      const cell = getContainerContent(ref.current!).at(-1)?.content?.[0]
        ?.content?.[0];

      expect({
        colspan: cell?.attrs?.colspan,
        style: cell?.attrs?.style,
      }).toEqual({
        colspan: 2,
        style: 'padding:12px;background-color:#f7f7f7',
      });

      const exported = getExportedContent(
        await renderMaily(json)
      )?.querySelector('td');

      expect({
        colspan: exported?.getAttribute('colspan'),
        style: exported?.getAttribute('style'),
      }).toEqual({
        colspan: '2',
        style: 'padding:12px;background-color:#f7f7f7',
      });
    });

    it('folds presentational attributes into the style a declaration owns', async () => {
      const { ref } = await render({
        content: `<table role="presentation" align="center" width="600"><tbody>
        <tr>
          <td align="center" bgcolor="#f7f7f7" valign="top" width="600"><p>Folded</p></td>
          <td align="left" style="width:50%" width="300"><p>Authored</p></td>
        </tr>
      </tbody></table>`,
      });

      const table = getContainerContent(ref.current!).at(-1);
      const cells = table?.content?.[0]?.content ?? [];

      expect({
        authored: getStyle(cells[1]),
        folded: getStyle(cells[0]),
        table: getStyle(table),
      }).toEqual({
        authored: { textAlign: 'left', width: '50%' },
        folded: {
          backgroundColor: '#f7f7f7',
          textAlign: 'center',
          verticalAlign: 'top',
          width: '600px',
        },
        table: { marginLeft: 'auto', marginRight: 'auto', width: '600px' },
      });
    });

    it('exports a declaration as both the attribute and the declaration', async () => {
      const exported = getExportedContent(
        await renderMaily(
          getDocument([
            {
              type: 'table',
              attrs: {
                responsive: false,
                style: 'width:600px;margin-left:auto;margin-right:auto',
              },
              content: [
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableCell',
                      attrs: {
                        colspan: 1,
                        colwidth: null,
                        rowspan: 1,
                        style:
                          'width:600px;text-align:center;vertical-align:top;background-color:#f7f7f7',
                      },
                      content: [{ type: 'paragraph' }],
                    },
                  ],
                },
              ],
            },
          ])
        )
      );

      const table = exported?.querySelector('table[role="presentation"]');
      const cell = exported?.querySelector('td');

      expect({
        cell: {
          align: cell?.getAttribute('align'),
          bgcolor: cell?.getAttribute('bgcolor'),
          style: parseInlineStyles(cell?.getAttribute('style') ?? ''),
          valign: cell?.getAttribute('valign'),
          width: cell?.getAttribute('width'),
        },
        table: {
          align: table?.getAttribute('align'),
          width: table?.getAttribute('width'),
        },
      }).toEqual({
        cell: {
          align: 'center',
          bgcolor: '#f7f7f7',
          style: {
            backgroundColor: '#f7f7f7',
            textAlign: 'center',
            verticalAlign: 'top',
            width: '600px',
          },
          valign: 'top',
          width: '600',
        },
        table: { align: 'center', width: '600' },
      });
    });
  });

  describe('presentational attributes', () => {
    it('keeps cellpadding, cellspacing and border as node attributes', async () => {
      const { ref } = await render({
        content: `<table role="presentation" border="1" cellpadding="8" cellspacing="4"><tbody>
        <tr><td><p>Left</p></td><td><p>Right</p></td></tr>
      </tbody></table>`,
      });

      const json = ref.current!.getJSON();
      const table = getContainerContent(ref.current!).at(-1);

      expect({
        border: table?.attrs?.border,
        cellpadding: table?.attrs?.cellpadding,
        cellspacing: table?.attrs?.cellspacing,
      }).toEqual({ border: 1, cellpadding: 8, cellspacing: 4 });

      const exported = getExportedContent(
        await renderMaily(json)
      )?.querySelector('table');

      expect({
        border: exported?.getAttribute('border'),
        cellpadding: exported?.getAttribute('cellpadding'),
        cellspacing: exported?.getAttribute('cellspacing'),
      }).toEqual({ border: '1', cellpadding: '8', cellspacing: '4' });
    });

    it('emits row presentational attributes on export', async () => {
      const { ref } = await render({
        content: `<table role="presentation"><tbody>
        <tr align="center" bgcolor="#eeeeee" valign="middle">
          <td><p>Left</p></td><td><p>Right</p></td>
        </tr>
      </tbody></table>`,
      });

      const exported = getExportedContent(
        await renderMaily(ref.current!.getJSON())
      )?.querySelector('tr');

      expect({
        align: exported?.getAttribute('align'),
        bgcolor: exported?.getAttribute('bgcolor'),
        valign: exported?.getAttribute('valign'),
      }).toEqual({ align: 'center', bgcolor: '#eeeeee', valign: 'middle' });
    });
  });

  describe('headers', () => {
    it('imports header cells and exports them as th', async () => {
      const { ref } = await render({
        content: `<table role="presentation"><tbody>
        <tr><th align="left" colspan="2"><p>Header</p></th></tr>
        <tr><td><p>Left</p></td><td><p>Right</p></td></tr>
      </tbody></table>`,
      });

      const json = ref.current!.getJSON();
      const header = getContainerContent(ref.current!).at(-1)?.content?.[0]
        ?.content?.[0];

      expect({
        colspan: header?.attrs?.colspan,
        style: getStyle(header),
        type: header?.type,
      }).toEqual({
        colspan: 2,
        style: { textAlign: 'left' },
        type: 'tableHeader',
      });

      const exported = getExportedContent(
        await renderMaily(json)
      )?.querySelector('th');

      expect({
        align: exported?.getAttribute('align'),
        colspan: exported?.getAttribute('colspan'),
      }).toEqual({ align: 'left', colspan: '2' });
    });

    it('drops the presentation role from a table that has headers', async () => {
      const { ref } = await render({
        content: `<table role="presentation"><tbody>
        <tr><th><p>Name</p></th><th><p>Total</p></th></tr>
        <tr><td><p>Ada</p></td><td><p>3</p></td></tr>
      </tbody></table>`,
      });

      const exported = getExportedContent(
        await renderMaily(ref.current!.getJSON())
      )?.querySelector('table');

      expect(exported?.getAttribute('role')).toBeNull();
    });
  });

  it('moves the selection to the next cell on Tab', async () => {
    const { editable, ref } = await render();

    await userEvent.click(editable);

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .insertTable({ cols: 2, rows: 1, withHeaderRow: false })
      .run();

    await userEvent.keyboard('first{Tab}second');

    const row = getContainerContent(ref.current!).at(-1)?.content?.[0];

    expect(
      row?.content?.map((cell) => cell.content?.[0]?.content?.[0]?.text)
    ).toEqual(['first', 'second']);
  });
});
