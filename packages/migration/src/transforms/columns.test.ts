import { describe, expect, it } from 'vite-plus/test';

import { columns } from './columns';

describe('transformColumns', () => {
  it('adds columnCount from content length', () => {
    const node = {
      type: 'columns',
      attrs: {} as Record<string, any>,
      content: [
        { type: 'column', attrs: {} },
        { type: 'column', attrs: {} },
      ],
    };
    columns(node, []);

    expect(node.attrs.columnCount).toBe(2);
  });

  it('defaults columnCount to 0 when no content', () => {
    const node = { type: 'columns', attrs: {} } as Record<string, any>;
    columns(node, []);

    expect(node.attrs.columnCount).toBe(0);
  });

  it('adds gap default of 8', () => {
    const node = { type: 'columns', attrs: {} } as Record<string, any>;
    columns(node, []);

    expect(node.attrs.gap).toBe(8);
  });

  it('preserves existing gap', () => {
    const node = { type: 'columns', attrs: { gap: 16 } } as Record<string, any>;
    columns(node, []);

    expect(node.attrs.gap).toBe(16);
  });
});
