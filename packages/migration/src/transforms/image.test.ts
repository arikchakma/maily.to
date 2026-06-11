import { describe, expect, it } from 'vite-plus/test';

import { image } from './image';

describe('transformImage', () => {
  function makeImage(attrs: Record<string, any> = {}) {
    return { type: 'image', attrs } as Record<string, any>;
  }

  it('renames alignment to align', () => {
    const node = makeImage({ alignment: 'center' });
    image(node, []);

    expect(node.attrs.align).toBe('center');
    expect(node.attrs).not.toHaveProperty('alignment');
  });

  it('splits borderRadius to 4 corners', () => {
    const node = makeImage({ borderRadius: 8 });
    image(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(8);
    expect(node.attrs.borderTopRightRadius).toBe(8);
    expect(node.attrs.borderBottomRightRadius).toBe(8);
    expect(node.attrs.borderBottomLeftRadius).toBe(8);
    expect(node.attrs).not.toHaveProperty('borderRadius');
  });

  it('converts width auto to 100%', () => {
    const node = makeImage({ width: 'auto' });
    image(node, []);

    expect(node.attrs.width).toBe('100%');
  });

  it('converts numeric string width to percentage', () => {
    const node = makeImage({ width: '200' });
    image(node, []);

    // 200 / 600 = 33%
    expect(node.attrs.width).toBe('33%');
  });

  it('converts numeric width to percentage', () => {
    const node = makeImage({ width: 300 });
    image(node, []);

    // 300 / 600 = 50%
    expect(node.attrs.width).toBe('50%');
  });

  it('preserves existing percentage width', () => {
    const node = makeImage({ width: '50%' });
    image(node, []);

    expect(node.attrs.width).toBe('50%');
  });

  it('uses _containerWidth for percentage calculation', () => {
    const node = makeImage({ width: '200', _containerWidth: 300 });
    image(node, []);

    // 200 / 300 = 67%
    expect(node.attrs.width).toBe('67%');
    expect(node.attrs).not.toHaveProperty('_containerWidth');
  });

  it('clamps small pixel width to minimum 5%', () => {
    const node = makeImage({ width: 10 });
    image(node, []);

    // 10 / 600 = 2% → clamped to 5%
    expect(node.attrs.width).toBe('5%');
  });

  it('sets border defaults', () => {
    const node = makeImage({});
    image(node, []);

    expect(node.attrs.borderRadiusMode).toBe('uniform');
    expect(node.attrs.borderWidthMode).toBe('uniform');
    expect(node.attrs.borderStyle).toBe('solid');
    expect(node.attrs.borderColor).toBe('#000000');
    expect(node.attrs.borderTopWidth).toBe(0);
  });

  it('drops height, isSrcVariable, isExternalLinkVariable, lockAspectRatio, aspectRatio', () => {
    const node = makeImage({
      height: 100,
      isSrcVariable: true,
      isExternalLinkVariable: false,
      lockAspectRatio: true,
      aspectRatio: 1.5,
    });
    image(node, []);

    expect(node.attrs).not.toHaveProperty('height');
    expect(node.attrs).not.toHaveProperty('isSrcVariable');
    expect(node.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(node.attrs).not.toHaveProperty('lockAspectRatio');
    expect(node.attrs).not.toHaveProperty('aspectRatio');
  });
});
