import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

type MigratedColumnsOptions = {
  attrs?: Record<string, any>;
  columns?: Record<string, any>[];
};

const getMigratedColumns = (options: MigratedColumnsOptions) => {
  const { attrs = {}, columns = [{}] } = options;
  const result = migrate({
    type: 'doc',
    content: [
      {
        type: 'columns',
        attrs,
        content: columns.map((columnAttrs) => {
          return { type: 'column', attrs: columnAttrs, content: [] };
        }),
      },
    ],
  });

  return { node: result.json.content[0], warnings: result.warnings };
};

const getMigratedColumn = (attrs: Record<string, any>) => {
  const { node, warnings } = getMigratedColumns({ columns: [attrs] });

  return { column: node.content[0], warnings };
};

const WIDTH_CASES: {
  expected: number | null;
  name: string;
  width: unknown;
}[] = [
  { name: 'converts an auto width to null', width: 'auto', expected: null },
  {
    name: 'converts a percentage width to a number',
    width: '50%',
    expected: 50,
  },
  {
    name: 'converts a unit-less percentage width to a number',
    width: '33.5',
    expected: 33.5,
  },
  {
    name: 'converts an unparseable width to null',
    width: 'wide',
    expected: null,
  },
  { name: 'leaves a numeric width alone', width: 25, expected: 25 },
];

describe('columns', () => {
  it('counts the column children and defaults the gap', () => {
    const { node, warnings } = getMigratedColumns({ columns: [{}, {}, {}] });

    expect(node.attrs.columnCount).toBe(3);
    expect(node.attrs.gap).toBe(8);
    expect(warnings).toEqual([]);
  });

  it('keeps an explicit column count and gap', () => {
    const { node } = getMigratedColumns({
      attrs: { columnCount: 4, gap: 24 },
      columns: [{}, {}],
    });

    expect(node.attrs.columnCount).toBe(4);
    expect(node.attrs.gap).toBe(24);
  });

  it('counts zero columns when there is no content', () => {
    const { node } = getMigratedColumns({ columns: [] });

    expect(node.attrs.columnCount).toBe(0);
  });

  it('keeps a zero gap', () => {
    const { node } = getMigratedColumns({ attrs: { gap: 0 } });

    expect(node.attrs.gap).toBe(0);
  });
});

describe('column', () => {
  it.each(WIDTH_CASES)('$name', ({ expected, width }) => {
    expect(getMigratedColumn({ width }).column.attrs.width).toBe(expected);
  });

  it('passes verticalAlign through', () => {
    expect(
      getMigratedColumn({ verticalAlign: 'middle' }).column.attrs.verticalAlign
    ).toBe('middle');
  });

  it('drops columnId with a warning', () => {
    const { column, warnings } = getMigratedColumn({ columnId: 'col-1' });

    expect(column.attrs).not.toHaveProperty('columnId');
    expect(warnings).toContainEqual({
      nodeType: 'column',
      field: 'columnId',
      message:
        'Column attribute "columnId" is not supported in v2 and was dropped',
    });
  });

  it('drops the visibility rule the global transform created', () => {
    const { column, warnings } = getMigratedColumn({ showIfKey: 'isActive' });

    expect(column.attrs).not.toHaveProperty('visibilityRule');
    expect(warnings).toContainEqual({
      nodeType: 'column',
      field: 'visibilityRule',
      message:
        'Column attribute "visibilityRule" is not supported in v2 and was dropped',
    });
  });

  it('converts the v1 styling attributes into one style', () => {
    const { column, warnings } = getMigratedColumn({
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderRadius: 6,
      borderWidth: 1,
      paddingBottom: 4,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 4,
    });

    expect(parseInlineStyles(column.attrs.style)).toEqual({
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderRadius: '6px',
      borderStyle: 'solid',
      borderWidth: '1px',
      paddingBottom: '4px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '4px',
    });
    expect(warnings).toEqual([
      {
        nodeType: 'column',
        field: 'backgroundColor',
        message: 'Migrated "backgroundColor" → "style"',
      },
      {
        nodeType: 'column',
        field: 'borderWidth',
        message: 'Migrated "borderWidth" → "style"',
      },
      {
        nodeType: 'column',
        field: 'borderColor',
        message: 'Migrated "borderColor" → "style"',
      },
      {
        nodeType: 'column',
        field: 'borderRadius',
        message: 'Migrated "borderRadius" → "style"',
      },
      {
        nodeType: 'column',
        field: 'padding',
        message: 'Migrated "padding*" → "style"',
      },
    ]);
  });

  it('writes no border for a zero width or a zero radius', () => {
    const { column, warnings } = getMigratedColumn({
      borderColor: '#cccccc',
      borderRadius: 0,
      borderWidth: 0,
    });

    expect(column.attrs).not.toHaveProperty('style');
    expect(warnings).toEqual([]);
  });

  it('merges the migrated declarations over an existing style', () => {
    const { column } = getMigratedColumn({
      backgroundColor: '#ffffff',
      style: 'background-color:#000000;color:#ff0000',
    });

    expect(parseInlineStyles(column.attrs.style)).toEqual({
      backgroundColor: '#ffffff',
      color: '#ff0000',
    });
  });

  it('deletes every v1 styling attribute', () => {
    const { column } = getMigratedColumn({
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderRadius: 6,
      borderWidth: 1,
      paddingBottom: 4,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 4,
    });

    for (const field of [
      'backgroundColor',
      'borderColor',
      'borderRadius',
      'borderWidth',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]) {
      expect(column.attrs).not.toHaveProperty(field);
    }
  });

  it('writes none of the beta mode attributes', () => {
    const { column } = getMigratedColumn({ borderRadius: 6, borderWidth: 1 });

    for (const field of [
      'borderRadiusMode',
      'borderStyle',
      'borderTopLeftRadius',
      'borderTopWidth',
      'borderWidthMode',
      'paddingMode',
    ]) {
      expect(column.attrs).not.toHaveProperty(field);
    }
  });
});
