import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedLink(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {},
        content: [
          {
            type: 'text',
            text: 'Visit',
            marks: [{ type: 'link', attrs }],
          },
        ],
      },
    ],
  });

  return { mark: json.content[0].content[0].marks[0], warnings };
}

describe('link', () => {
  it('converts a variable href to a variable reference', () => {
    const { mark, warnings } = getMigratedLink({
      href: 'profileUrl',
      isUrlVariable: true,
    });

    expect(mark.attrs.href).toBe('{{profileUrl}}');
    expect(mark.attrs).not.toHaveProperty('isUrlVariable');
    expect(warnings).toContainEqual({
      nodeType: 'link',
      field: 'isUrlVariable',
      message: 'Migrated "isUrlVariable" → variable reference in "href"',
    });
  });

  it('drops isUrlVariable false without a warning', () => {
    const { mark, warnings } = getMigratedLink({
      href: 'https://example.com',
      isUrlVariable: false,
    });

    expect(mark.attrs.href).toBe('https://example.com');
    expect(mark.attrs).not.toHaveProperty('isUrlVariable');
    expect(warnings).toEqual([]);
  });

  it('leaves a link without the flag untouched', () => {
    const { mark, warnings } = getMigratedLink({
      href: 'https://example.com',
      target: '_blank',
    });

    expect(mark.attrs).toEqual({
      href: 'https://example.com',
      target: '_blank',
    });
    expect(warnings).toEqual([]);
  });
});
