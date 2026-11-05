import type { DocumentNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

function gappedColumns() {
  return {
    type: 'columns' as const,
    attrs: { columnCount: 2, gap: 8 },
    content: [
      {
        type: 'column' as const,
        attrs: { verticalAlign: 'top', width: null },
        content: [{ type: 'paragraph' as const }],
      },
      {
        type: 'column' as const,
        attrs: { verticalAlign: 'top', width: null },
        content: [{ type: 'paragraph' as const }],
      },
    ],
  };
}

function getWidths(html: string) {
  return parse(html)
    .querySelectorAll('.tab-row-full td')
    .map((cell) => cell.getAttribute('width'));
}

function columnsInContainer(containerStyle: string): DocumentNode {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      {
        type: 'container',
        attrs: { style: containerStyle },
        content: [gappedColumns()],
      },
    ],
  };
}

function columnsInCell(cellStyle?: string): DocumentNode {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      {
        type: 'table',
        attrs: { responsive: false },
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
                  style: cellStyle,
                },
                content: [gappedColumns()],
              },
              {
                type: 'tableCell',
                attrs: { colspan: 1, colwidth: null, rowspan: 1 },
                content: [{ type: 'paragraph' }],
              },
            ],
          },
        ],
      },
    ],
  };
}

const CASES = [
  {
    document: columnsInCell(),
    name: 'measures a cell child against the cell rather than the container',
    widths: ['48.667%', '2.667%', '48.667%'],
  },
  {
    document: columnsInCell('width:25%'),
    name: 'uses a declared cell width when the cell has one',
    widths: ['47.334%', '5.333%', '47.334%'],
  },
  {
    document: columnsInCell('width:50%;padding-left:25px;padding-right:25px'),
    name: 'insets a cell child by the cell padding',
    widths: ['48.4%', '3.2%', '48.4%'],
  },
  {
    document: columnsInCell('width:50%;padding:25px'),
    name: 'insets a cell child by a padding shorthand',
    widths: ['48.4%', '3.2%', '48.4%'],
  },
  {
    document: columnsInCell('width:50%;border:10px solid #cccccc'),
    name: 'insets a cell child by a border shorthand',
    widths: ['48.572%', '2.857%', '48.572%'],
  },
  {
    document: columnsInContainer('max-width:600px;padding:50px'),
    name: 'insets a container child by a padding shorthand',
    widths: ['49.2%', '1.6%', '49.2%'],
  },
];

describe('box model', () => {
  for (const { document, name, widths } of CASES) {
    it(name, async () => {
      expect(getWidths(await render(document))).toEqual(widths);
    });
  }
});
