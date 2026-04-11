import { describe, expect, it } from 'vite-plus/test';

import { footer } from './footer';

describe('transformFooter', () => {
  it('drops maily-component attribute', () => {
    const node = {
      type: 'footer',
      attrs: { 'maily-component': 'footer', textAlign: 'center' },
    } as Record<string, any>;
    footer(node, []);

    expect(node.attrs).not.toHaveProperty('maily-component');
    expect(node.attrs.textAlign).toBe('center');
  });
});
