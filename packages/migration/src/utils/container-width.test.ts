import { describe, expect, it } from 'vite-plus/test';

import { annotateContainerWidths } from './container-width';

function makeDoc(content: Record<string, any>[]): Record<string, any> {
  return { type: 'doc', content };
}

describe('annotateContainerWidths', () => {
  it('stamps root-level image with 600px', () => {
    const doc = makeDoc([{ type: 'image', attrs: { src: 'test.png' } }]);

    annotateContainerWidths(doc);
    expect(doc.content[0].attrs._containerWidth).toBe(600);
  });

  it('stamps root-level logo with 600px', () => {
    const doc = makeDoc([{ type: 'logo', attrs: { size: 'lg' } }]);

    annotateContainerWidths(doc);
    expect(doc.content[0].attrs._containerWidth).toBe(600);
  });

  it('narrows width through section padding', () => {
    const doc = makeDoc([
      {
        type: 'section',
        attrs: { paddingLeft: 20, paddingRight: 20 },
        content: [{ type: 'image', attrs: { src: 'test.png' } }],
      },
    ]);

    annotateContainerWidths(doc);
    // 600 - 20 - 20 = 560
    expect(doc.content[0].content[0].attrs._containerWidth).toBe(560);
  });

  it('narrows width through section border', () => {
    const doc = makeDoc([
      {
        type: 'section',
        attrs: { borderWidth: 2 },
        content: [{ type: 'image', attrs: { src: 'test.png' } }],
      },
    ]);

    annotateContainerWidths(doc);
    // 600 - 2*2 = 596
    expect(doc.content[0].content[0].attrs._containerWidth).toBe(596);
  });

  it('narrows width through section padding and border', () => {
    const doc = makeDoc([
      {
        type: 'section',
        attrs: { paddingLeft: 32, paddingRight: 32, borderWidth: 1 },
        content: [{ type: 'image', attrs: { src: 'test.png' } }],
      },
    ]);

    annotateContainerWidths(doc);
    // 600 - 32 - 32 - 1*2 = 534
    expect(doc.content[0].content[0].attrs._containerWidth).toBe(534);
  });

  it('narrows width through columns with explicit widths', () => {
    const doc = makeDoc([
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
    const doc = makeDoc([
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
    const doc = makeDoc([
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
    const doc = makeDoc([
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
    const doc = makeDoc([{ type: 'paragraph', attrs: { id: 'p1' } }]);

    annotateContainerWidths(doc);
    expect(doc.content[0].attrs).not.toHaveProperty('_containerWidth');
  });

  it('creates attrs object for image nodes without one', () => {
    const doc = makeDoc([{ type: 'image' }]);

    annotateContainerWidths(doc);
    expect(doc.content[0].attrs._containerWidth).toBe(600);
  });

  it('allows overriding root width', () => {
    const doc = makeDoc([{ type: 'image', attrs: { src: 'test.png' } }]);

    annotateContainerWidths(doc, 400);
    expect(doc.content[0].attrs._containerWidth).toBe(400);
  });

  it('handles three columns with middle column getting full gap', () => {
    const doc = makeDoc([
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
