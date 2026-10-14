import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedSpacer(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [{ type: 'spacer', attrs }],
  });

  return { node: json.content[0], warnings };
}

const HEIGHT_CASES = [
  {
    name: 'passes a numeric height through without a warning',
    attrs: { height: 24 },
    expected: 24,
  },
  { name: 'keeps a zero height', attrs: { height: 0 }, expected: 0 },
  { name: 'defaults a missing height', attrs: {}, expected: 8 },
  { name: 'defaults a null height', attrs: { height: null }, expected: 8 },
  {
    name: 'defaults an unknown string height',
    attrs: { height: 'huge' },
    expected: 8,
  },
  {
    name: 'defaults a numeric string height',
    attrs: { height: '24' },
    expected: 8,
  },
];

describe('spacer', () => {
  it('maps the string enum heights to numbers', () => {
    const heights = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 };

    for (const [short, value] of Object.entries(heights)) {
      const { node, warnings } = getMigratedSpacer({ height: short });

      expect(node.attrs.height).toBe(value);
      expect(warnings).toContainEqual({
        nodeType: 'spacer',
        field: 'height',
        message: `Migrated "height" from string enum to number: ${short} → ${value}`,
      });
    }
  });

  it.each(HEIGHT_CASES)('$name', ({ attrs, expected }) => {
    const { node, warnings } = getMigratedSpacer(attrs);

    expect(node.attrs.height).toBe(expected);
    expect(warnings).toEqual([]);
  });

  it('does not add heightMode', () => {
    const { node } = getMigratedSpacer({ height: 'md' });

    expect(node.attrs).not.toHaveProperty('heightMode');
  });
});
