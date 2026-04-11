import { describe, expect, it } from 'vite-plus/test';

import { spacer } from './spacer';

describe('transformSpacer', () => {
  it('sets heightMode to uniform', () => {
    const node = { type: 'spacer', attrs: { height: 20 } } as Record<
      string,
      any
    >;
    spacer(node, []);

    expect(node.attrs.heightMode).toBe('uniform');
  });

  it('preserves existing heightMode', () => {
    const node = {
      type: 'spacer',
      attrs: { height: 20, heightMode: 'mixed' },
    } as Record<string, any>;
    spacer(node, []);

    expect(node.attrs.heightMode).toBe('mixed');
  });
});
