import type { ColumnNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';
import { calculateColumnLayout } from '../src/lib/columns';

function column(width: ColumnNode['attrs']['width']): ColumnNode {
  return {
    type: 'column',
    attrs: { verticalAlign: 'top', width },
    content: [],
  };
}

describe('columns', () => {
  describe('the column layout', () => {
    it('gives auto columns the space fixed columns and gaps leave', () => {
      const layout = calculateColumnLayout([column(40), column(null)], 8, 600);

      expect({
        rowWidthPercent: layout.rowWidthPercent,
        widths: layout.columns.map((item) => item.containerPercent),
      }).toEqual({ rowWidthPercent: 100, widths: [40, 58.667] });
    });

    it('shrinks the row when every column is fixed and they fit', () => {
      const layout = calculateColumnLayout([column(20), column(20)], 8, 600);

      expect({
        gapTdWidthPercent: layout.gapTdWidthPercent,
        rowWidthPercent: layout.rowWidthPercent,
        tdWidths: layout.columns.map((item) => item.tdWidthPercent),
      }).toEqual({
        gapTdWidthPercent: 3.225,
        rowWidthPercent: 41.333,
        tdWidths: [48.387, 48.387],
      });
    });

    it('scales fixed columns down when they overflow the container', () => {
      const layout = calculateColumnLayout([column(50), column(50)], 8, 600);

      expect({
        rowWidthPercent: layout.rowWidthPercent,
        widths: layout.columns.map((item) => item.containerPercent),
      }).toEqual({ rowWidthPercent: 100, widths: [49.342, 49.342] });
    });

    it('measures a pixel column against the container', () => {
      const layout = calculateColumnLayout(
        [column('200px'), column(null)],
        0,
        600
      );

      expect(layout.columns.map((item) => item.containerPercent)).toEqual([
        33.333, 66.667,
      ]);
    });

    it('treats a width no container can measure as auto', () => {
      const layout = calculateColumnLayout(
        [column('12em'), column(null)],
        0,
        600
      );

      expect(layout.columns.map((item) => item.containerPercent)).toEqual([
        50, 50,
      ]);
    });

    it('returns nothing for an empty column list', () => {
      expect(calculateColumnLayout([], 8, 600)).toEqual({
        columns: [],
        gapTdWidthPercent: 0,
        rowWidthPercent: 0,
      });
    });
  });

  describe('rendering', () => {
    it('renders columns as a row with gap spacer cells', async () => {
      const html = await render({
        type: 'doc',
        attrs: { version: 2 },
        content: [
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
        ],
      });

      const cells = parse(html).querySelectorAll('.tab-row-full td');

      expect({
        responsive: html.includes('@media only screen and (max-width:425px)'),
        texts: cells.map((cell) => cell.textContent),
        widths: cells.map((cell) => cell.getAttribute('width')),
      }).toEqual({
        responsive: true,
        texts: ['Left', '', 'Right'],
        widths: ['49.334%', '1.333%', '49.334%'],
      });
    });

    it('omits spacer cells when the gap is zero', async () => {
      const html = await render({
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'columns',
            attrs: { columnCount: 2, gap: 0 },
            content: [
              {
                type: 'column',
                attrs: { verticalAlign: 'top', width: 30 },
                content: [{ type: 'paragraph' }],
              },
              {
                type: 'column',
                attrs: { verticalAlign: 'top', width: 70 },
                content: [{ type: 'paragraph' }],
              },
            ],
          },
        ],
      });

      expect(
        parse(html)
          .querySelectorAll('.tab-row-full td')
          .map((cell) => cell.getAttribute('width'))
      ).toEqual(['30%', '70%']);
    });
  });
});
