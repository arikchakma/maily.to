import { describe, expect, it } from 'vite-plus/test';

import { section } from './section';

describe('transformSection', () => {
  function makeSection(attrs: Record<string, any> = {}) {
    return { type: 'section', attrs } as Record<string, any>;
  }

  it('splits borderRadius to 4 corners', () => {
    const node = makeSection({ borderRadius: 12 });
    section(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(12);
    expect(node.attrs.borderTopRightRadius).toBe(12);
    expect(node.attrs.borderBottomRightRadius).toBe(12);
    expect(node.attrs.borderBottomLeftRadius).toBe(12);
    expect(node.attrs).not.toHaveProperty('borderRadius');
  });

  it('splits borderWidth to 4 sides', () => {
    const node = makeSection({ borderWidth: 2 });
    section(node, []);

    expect(node.attrs.borderTopWidth).toBe(2);
    expect(node.attrs.borderRightWidth).toBe(2);
    expect(node.attrs.borderBottomWidth).toBe(2);
    expect(node.attrs.borderLeftWidth).toBe(2);
    expect(node.attrs).not.toHaveProperty('borderWidth');
  });

  it('sets mode defaults', () => {
    const node = makeSection({});
    section(node, []);

    expect(node.attrs.borderRadiusMode).toBe('uniform');
    expect(node.attrs.borderWidthMode).toBe('uniform');
    expect(node.attrs.paddingMode).toBe('uniform');
    expect(node.attrs.marginMode).toBe('mixed');
    expect(node.attrs.borderStyle).toBe('solid');
    expect(node.attrs.borderColor).toBe('#000000');
  });
});
