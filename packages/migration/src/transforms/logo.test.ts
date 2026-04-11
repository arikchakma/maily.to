import { describe, expect, it } from 'vite-plus/test';

import { logo } from './logo';

describe('transformLogo', () => {
  function makeLogo(attrs: Record<string, any> = {}) {
    return { type: 'logo', attrs } as Record<string, any>;
  }

  it('changes type from logo to image', () => {
    const node = makeLogo({});
    logo(node, []);

    expect(node.type).toBe('image');
  });

  it('maps size sm to width 7%', () => {
    const node = makeLogo({ size: 'sm' });
    logo(node, []);

    expect(node.attrs.width).toBe('7%');
    expect(node.attrs).not.toHaveProperty('size');
  });

  it('maps size md to width 8%', () => {
    const node = makeLogo({ size: 'md' });
    logo(node, []);

    expect(node.attrs.width).toBe('8%');
  });

  it('maps size lg to width 11%', () => {
    const node = makeLogo({ size: 'lg' });
    logo(node, []);

    expect(node.attrs.width).toBe('11%');
  });

  it('defaults unknown size to 8%', () => {
    const node = makeLogo({ size: 'xl' });
    logo(node, []);

    expect(node.attrs.width).toBe('8%');
  });

  it('uses _containerWidth for percentage calculation', () => {
    const node = makeLogo({ size: 'lg', _containerWidth: 200 });
    logo(node, []);

    // 64 / 200 = 32%
    expect(node.attrs.width).toBe('32%');
    expect(node.attrs).not.toHaveProperty('_containerWidth');
  });

  it('renames alignment to align', () => {
    const node = makeLogo({ alignment: 'center' });
    logo(node, []);

    expect(node.attrs.align).toBe('center');
    expect(node.attrs).not.toHaveProperty('alignment');
  });

  it('sets image border defaults', () => {
    const node = makeLogo({});
    logo(node, []);

    expect(node.attrs.borderRadiusMode).toBe('uniform');
    expect(node.attrs.borderWidthMode).toBe('uniform');
    expect(node.attrs.borderStyle).toBe('solid');
    expect(node.attrs.borderTopLeftRadius).toBe(0);
    expect(node.attrs.borderTopWidth).toBe(0);
  });

  it('drops isSrcVariable', () => {
    const node = makeLogo({ isSrcVariable: true });
    logo(node, []);

    expect(node.attrs).not.toHaveProperty('isSrcVariable');
  });

  it('drops maily-component attribute', () => {
    const node = makeLogo({ 'maily-component': 'logo' });
    logo(node, []);

    expect(node.attrs).not.toHaveProperty('maily-component');
  });
});
