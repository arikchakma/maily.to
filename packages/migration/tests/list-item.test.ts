import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedListItem(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        attrs: {},
        content: [
          {
            type: 'listItem',
            attrs,
            content: [{ type: 'paragraph', attrs: {} }],
          },
        ],
      },
    ],
  });

  return { node: json.content[0].content[0], warnings };
}

const COLOR_WARNING = {
  nodeType: 'listItem',
  field: 'color',
  message: 'Migrated "color" → "style"',
};

type ColorCase = {
  attrs: Record<string, any>;
  name: string;
  style: Record<string, string> | string | null;
  warned: boolean;
};

const COLOR_CASES: ColorCase[] = [
  {
    name: 'converts color to a style declaration',
    attrs: { color: '#ff0000' },
    style: { color: '#ff0000' },
    warned: true,
  },
  {
    name: 'merges color into an existing style',
    attrs: { color: '#ff0000', style: 'font-weight:700' },
    style: { fontWeight: '700', color: '#ff0000' },
    warned: true,
  },
  {
    name: 'overrides a color already present in the style',
    attrs: { color: '#ff0000', style: 'color:#00ff00;font-weight:700' },
    style: { color: '#ff0000', fontWeight: '700' },
    warned: true,
  },
  {
    name: 'drops a null color without a warning',
    attrs: { color: null },
    style: null,
    warned: false,
  },
  {
    name: 'drops an empty color without writing a style',
    attrs: { color: '' },
    style: null,
    warned: false,
  },
  {
    name: 'leaves a list item without a color untouched',
    attrs: { style: 'color:#00ff00' },
    style: 'color:#00ff00',
    warned: false,
  },
];

describe('listItem', () => {
  it.each(COLOR_CASES)('$name', ({ attrs, style, warned }) => {
    const { node, warnings } = getMigratedListItem(attrs);

    if (style === null) {
      expect(node.attrs).not.toHaveProperty('style');
    } else if (typeof style === 'string') {
      expect(node.attrs.style).toBe(style);
    } else {
      expect(parseInlineStyles(node.attrs.style)).toEqual(style);
    }

    expect(node.attrs).not.toHaveProperty('color');

    if (warned) {
      expect(warnings).toContainEqual(COLOR_WARNING);
    } else {
      expect(warnings).toEqual([]);
    }
  });
});
