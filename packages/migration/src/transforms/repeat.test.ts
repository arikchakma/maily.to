import { describe, expect, it } from 'vite-plus/test';

import { repeat } from './repeat';

describe('transformRepeat', () => {
  it('wraps each value in template syntax', () => {
    const node = {
      type: 'repeat',
      attrs: { each: 'items' },
    } as Record<string, any>;
    repeat(node, []);

    expect(node.attrs.each).toBe('{{items}}');
  });

  it('does not double-wrap already wrapped values', () => {
    const node = {
      type: 'repeat',
      attrs: { each: '{{items}}' },
    } as Record<string, any>;
    repeat(node, []);

    expect(node.attrs.each).toBe('{{items}}');
  });

  it('does not wrap empty string', () => {
    const node = {
      type: 'repeat',
      attrs: { each: '' },
    } as Record<string, any>;
    repeat(node, []);

    expect(node.attrs.each).toBe('');
  });

  it('drops isUpdatingKey', () => {
    const node = {
      type: 'repeat',
      attrs: { each: 'items', isUpdatingKey: true },
    } as Record<string, any>;
    repeat(node, []);

    expect(node.attrs).not.toHaveProperty('isUpdatingKey');
  });
});
