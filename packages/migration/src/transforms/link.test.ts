import { describe, expect, it } from 'vite-plus/test';

import { link } from './link';

describe('transformLink', () => {
  it('drops isUrlVariable from link mark attrs', () => {
    const mark = {
      type: 'link',
      attrs: { href: 'https://example.com', isUrlVariable: true },
    };
    link(mark, []);

    expect(mark.attrs).not.toHaveProperty('isUrlVariable');
    expect(mark.attrs.href).toBe('https://example.com');
  });

  it('preserves other link attrs', () => {
    const mark = {
      type: 'link',
      attrs: { href: 'https://example.com', target: '_blank' },
    };
    link(mark, []);

    expect(mark.attrs.href).toBe('https://example.com');
    expect(mark.attrs.target).toBe('_blank');
  });
});
