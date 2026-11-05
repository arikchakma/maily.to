import { describe, expect, it } from 'vite-plus/test';

import { annotateContainerWidths } from '../src/utils/container-width';

function getDoc(content: Record<string, any>[]): Record<string, any> {
  return { type: 'doc', content };
}

const ROOT_CASES: {
  expected: number;
  name: string;
  node: Record<string, any>;
  rootWidth?: number;
}[] = [
  {
    name: 'stamps root-level image with 600px',
    node: { type: 'image', attrs: { src: 'test.png' } },
    expected: 600,
  },
  {
    name: 'stamps root-level logo with 600px',
    node: { type: 'logo', attrs: { size: 'lg' } },
    expected: 600,
  },
  {
    name: 'creates attrs object for image nodes without one',
    node: { type: 'image' },
    expected: 600,
  },
  {
    name: 'allows overriding root width',
    node: { type: 'image', attrs: { src: 'test.png' } },
    rootWidth: 400,
    expected: 400,
  },
];

const SECTION_CASES = [
  {
    name: 'narrows width through section padding',
    attrs: { paddingLeft: 20, paddingRight: 20 },
    // 600 - 20 - 20 = 560
    expected: 560,
  },
  {
    name: 'narrows width through section border',
    attrs: { borderWidth: 2 },
    // 600 - 2*2 = 596
    expected: 596,
  },
  {
    name: 'narrows width through section padding and border',
    attrs: { paddingLeft: 32, paddingRight: 32, borderWidth: 1 },
    // 600 - 32 - 32 - 1*2 = 534
    expected: 534,
  },
];

describe('annotateContainerWidths', () => {
  it.each(ROOT_CASES)('$name', ({ node, rootWidth, expected }) => {
    const doc = getDoc([node]);

    annotateContainerWidths(doc, rootWidth);
    expect(doc.content[0].attrs._containerWidth).toBe(expected);
  });

  it.each(SECTION_CASES)('$name', ({ attrs, expected }) => {
    const doc = getDoc([
      {
        type: 'section',
        attrs,
        content: [{ type: 'image', attrs: { src: 'test.png' } }],
      },
    ]);

    annotateContainerWidths(doc);
    expect(doc.content[0].content[0].attrs._containerWidth).toBe(expected);
  });

  it('narrows width through columns with explicit widths', () => {
    const doc = getDoc([
      {
        type: 'columns',
        attrs: { gap: 8 },
        content: [
          {
            type: 'column',
            attrs: { width: '50%' },
            content: [{ type: 'image', attrs: { src: 'a.png' } }],
          },
          {
            type: 'column',
            attrs: { width: '50%' },
            content: [{ type: 'image', attrs: { src: 'b.png' } }],
          },
        ],
      },
    ]);

    annotateContainerWidths(doc);
    // Each column: 600 * 0.50 - 4 (gap/2) = 296
    expect(doc.content[0].content[0].content[0].attrs._containerWidth).toBe(
      296
    );
    expect(doc.content[0].content[1].content[0].attrs._containerWidth).toBe(
      296
    );
  });

  it('handles auto-width columns', () => {
    const doc = getDoc([
      {
        type: 'columns',
        attrs: { gap: 8 },
        content: [
          {
            type: 'column',
            attrs: { width: '60%' },
            content: [{ type: 'image', attrs: { src: 'a.png' } }],
          },
          {
            type: 'column',
            attrs: { width: 'auto' },
            content: [{ type: 'image', attrs: { src: 'b.png' } }],
          },
        ],
      },
    ]);

    annotateContainerWidths(doc);
    // Column 1: 600 * 0.60 - 4 = 356
    expect(doc.content[0].content[0].content[0].attrs._containerWidth).toBe(
      356
    );
    // Column 2 (auto = 40%): 600 * 0.40 - 4 = 236
    expect(doc.content[0].content[1].content[0].attrs._containerWidth).toBe(
      236
    );
  });

  it('handles nested section inside column', () => {
    const doc = getDoc([
      {
        type: 'section',
        attrs: { paddingLeft: 20, paddingRight: 20 },
        content: [
          {
            type: 'columns',
            attrs: { gap: 8 },
            content: [
              {
                type: 'column',
                attrs: { width: '50%' },
                content: [{ type: 'image', attrs: { src: 'nested.png' } }],
              },
              {
                type: 'column',
                attrs: { width: '50%' },
                content: [{ type: 'logo', attrs: { size: 'lg' } }],
              },
            ],
          },
        ],
      },
    ]);

    annotateContainerWidths(doc);
    // Section narrows: 600 - 20 - 20 = 560
    // Column: 560 * 0.50 - 4 = 276
    expect(
      doc.content[0].content[0].content[0].content[0].attrs._containerWidth
    ).toBe(276);
    expect(
      doc.content[0].content[0].content[1].content[0].attrs._containerWidth
    ).toBe(276);
  });

  it('defaults gap to 8 when not specified', () => {
    const doc = getDoc([
      {
        type: 'columns',
        attrs: {},
        content: [
          {
            type: 'column',
            attrs: { width: '50%' },
            content: [{ type: 'image', attrs: { src: 'a.png' } }],
          },
          {
            type: 'column',
            attrs: { width: '50%' },
            content: [{ type: 'image', attrs: { src: 'b.png' } }],
          },
        ],
      },
    ]);

    annotateContainerWidths(doc);
    // 600 * 0.50 - 4 = 296
    expect(doc.content[0].content[0].content[0].attrs._containerWidth).toBe(
      296
    );
  });

  it('does not stamp non-image/logo nodes', () => {
    const doc = getDoc([{ type: 'paragraph', attrs: { id: 'p1' } }]);

    annotateContainerWidths(doc);
    expect(doc.content[0].attrs).not.toHaveProperty('_containerWidth');
  });

  it('handles three columns with middle column getting full gap', () => {
    const doc = getDoc([
      {
        type: 'columns',
        attrs: { gap: 12 },
        content: [
          {
            type: 'column',
            attrs: { width: '33%' },
            content: [{ type: 'image', attrs: {} }],
          },
          {
            type: 'column',
            attrs: { width: '34%' },
            content: [{ type: 'image', attrs: {} }],
          },
          {
            type: 'column',
            attrs: { width: '33%' },
            content: [{ type: 'image', attrs: {} }],
          },
        ],
      },
    ]);

    annotateContainerWidths(doc);
    // First: 600 * 0.33 - 6 = 192
    expect(
      doc.content[0].content[0].content[0].attrs._containerWidth
    ).toBeCloseTo(192, 5);
    // Middle: 600 * 0.34 - 12 = 192
    expect(
      doc.content[0].content[1].content[0].attrs._containerWidth
    ).toBeCloseTo(192, 5);
    // Last: 600 * 0.33 - 6 = 192
    expect(
      doc.content[0].content[2].content[0].attrs._containerWidth
    ).toBeCloseTo(192, 5);
  });
});
