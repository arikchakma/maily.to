import { describe, expect, it } from 'vite-plus/test';

import { inlineImage } from './inline-image';

describe('transformInlineImage', () => {
  it('converts null src to empty string', () => {
    const node = {
      type: 'inlineImage',
      attrs: { src: null },
    } as Record<string, any>;
    inlineImage(node, []);

    expect(node.attrs.src).toBe('');
  });

  it('converts undefined src to empty string', () => {
    const node = {
      type: 'inlineImage',
      attrs: {},
    } as Record<string, any>;
    inlineImage(node, []);

    expect(node.attrs.src).toBe('');
  });

  it('preserves non-null src', () => {
    const node = {
      type: 'inlineImage',
      attrs: { src: 'https://example.com/img.png' },
    } as Record<string, any>;
    inlineImage(node, []);

    expect(node.attrs.src).toBe('https://example.com/img.png');
  });

  it('drops isSrcVariable and isExternalLinkVariable', () => {
    const node = {
      type: 'inlineImage',
      attrs: {
        src: 'test.png',
        isSrcVariable: true,
        isExternalLinkVariable: false,
      },
    } as Record<string, any>;
    inlineImage(node, []);

    expect(node.attrs).not.toHaveProperty('isSrcVariable');
    expect(node.attrs).not.toHaveProperty('isExternalLinkVariable');
  });
});
