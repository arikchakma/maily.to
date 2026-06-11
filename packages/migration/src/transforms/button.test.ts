import { describe, expect, it } from 'vite-plus/test';

import { button } from './button';

describe('transformButton', () => {
  function makeButton(attrs: Record<string, any> = {}) {
    return { type: 'button', attrs } as Record<string, any>;
  }

  it('moves text to content as text node', () => {
    const node = makeButton({ text: 'Subscribe' });
    button(node, []);

    expect(node.content).toEqual([{ type: 'text', text: 'Subscribe' }]);
    expect(node.attrs).not.toHaveProperty('text');
  });

  it('moves variable text to content as variable node', () => {
    const node = makeButton({ text: 'firstName', isTextVariable: true });
    button(node, []);

    expect(node.content).toEqual([
      { type: 'variable', attrs: { id: 'firstName' } },
    ]);
    expect(node.attrs).not.toHaveProperty('text');
    expect(node.attrs).not.toHaveProperty('isTextVariable');
  });

  it('does not create content if text is empty', () => {
    const node = makeButton({ text: '' });
    button(node, []);

    expect(node.content).toBeUndefined();
  });

  it('preserves existing content', () => {
    const existing = [{ type: 'text', text: 'Existing' }];
    const node = {
      type: 'button',
      attrs: { text: 'New' },
      content: existing,
    };
    button(node, []);

    expect(node.content).toBe(existing);
  });

  it('renames buttonColor to backgroundColor', () => {
    const node = makeButton({ buttonColor: '#ff0000' });
    button(node, []);

    expect(node.attrs.backgroundColor).toBe('#ff0000');
    expect(node.attrs).not.toHaveProperty('buttonColor');
  });

  it('renames textColor to color', () => {
    const node = makeButton({ textColor: '#ffffff' });
    button(node, []);

    expect(node.attrs.color).toBe('#ffffff');
    expect(node.attrs).not.toHaveProperty('textColor');
  });

  it('converts outline variant to transparent background with border', () => {
    const node = makeButton({
      variant: 'outline',
      buttonColor: '#0066ff',
    });
    button(node, []);

    expect(node.attrs.backgroundColor).toBe('transparent');
    expect(node.attrs.borderColor).toBe('#0066ff');
    expect(node.attrs.borderTopWidth).toBe(2);
    expect(node.attrs.borderRightWidth).toBe(2);
    expect(node.attrs.borderBottomWidth).toBe(2);
    expect(node.attrs.borderLeftWidth).toBe(2);
    expect(node.attrs).not.toHaveProperty('variant');
  });

  it('converts borderRadius sharp to 0', () => {
    const node = makeButton({ borderRadius: 'sharp' });
    button(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(0);
    expect(node.attrs.borderTopRightRadius).toBe(0);
    expect(node.attrs.borderBottomRightRadius).toBe(0);
    expect(node.attrs.borderBottomLeftRadius).toBe(0);
    expect(node.attrs).not.toHaveProperty('borderRadius');
  });

  it('converts borderRadius smooth to 6', () => {
    const node = makeButton({ borderRadius: 'smooth' });
    button(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(6);
  });

  it('converts borderRadius round to 9999', () => {
    const node = makeButton({ borderRadius: 'round' });
    button(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(9999);
  });

  it('defaults unknown borderRadius to 9999', () => {
    const node = makeButton({ borderRadius: 'unknown' });
    button(node, []);

    expect(node.attrs.borderTopLeftRadius).toBe(9999);
  });

  it('sets required defaults', () => {
    const node = makeButton({});
    button(node, []);

    expect(node.attrs.kind).toBe('tight');
    expect(node.attrs.paddingMode).toBe('mixed');
    expect(node.attrs.borderRadiusMode).toBe('uniform');
    expect(node.attrs.borderWidthMode).toBe('uniform');
    expect(node.attrs.borderStyle).toBe('solid');
    expect(node.attrs.borderColor).toBe('#000000');
    expect(node.attrs.borderTopWidth).toBe(0);
    expect(node.attrs.borderRightWidth).toBe(0);
    expect(node.attrs.borderBottomWidth).toBe(0);
    expect(node.attrs.borderLeftWidth).toBe(0);
  });

  it('drops isUrlVariable', () => {
    const node = makeButton({ isUrlVariable: true });
    button(node, []);

    expect(node.attrs).not.toHaveProperty('isUrlVariable');
  });
});
