import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedInlineImage(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {},
        content: [{ type: 'inlineImage', attrs }],
      },
    ],
  });

  return { node: json.content[0].content[0], warnings };
}

const EMPTY_SRC_CASES = [
  { name: 'converts a null src to an empty string', attrs: { src: null } },
  { name: 'converts a missing src to an empty string', attrs: {} },
];

const FALSE_FLAG_CASES = [
  {
    name: 'drops isSrcVariable false without a warning',
    attrs: { src: 'https://example.com/logo.png', isSrcVariable: false },
    attr: 'src',
    flag: 'isSrcVariable',
    expected: 'https://example.com/logo.png',
  },
  {
    name: 'drops isExternalLinkVariable false without a warning',
    attrs: {
      src: 'https://example.com/logo.png',
      externalLink: 'https://example.com/profile',
      isExternalLinkVariable: false,
    },
    attr: 'externalLink',
    flag: 'isExternalLinkVariable',
    expected: 'https://example.com/profile',
  },
];

describe('inlineImage', () => {
  it.each(EMPTY_SRC_CASES)('$name', ({ attrs }) => {
    const { node } = getMigratedInlineImage(attrs);

    expect(node.attrs.src).toBe('');
  });

  it('converts a variable src to a variable reference', () => {
    const { node, warnings } = getMigratedInlineImage({
      src: 'logoUrl',
      isSrcVariable: true,
    });

    expect(node.attrs.src).toBe('{{logoUrl}}');
    expect(node.attrs).not.toHaveProperty('isSrcVariable');
    expect(warnings).toContainEqual({
      nodeType: 'inlineImage',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
  });

  it.each(FALSE_FLAG_CASES)('$name', ({ attr, attrs, expected, flag }) => {
    const { node, warnings } = getMigratedInlineImage(attrs);

    expect(node.attrs[attr]).toBe(expected);
    expect(node.attrs).not.toHaveProperty(flag);
    expect(warnings).toEqual([]);
  });

  it('converts a variable external link to a variable reference', () => {
    const { node, warnings } = getMigratedInlineImage({
      src: 'https://example.com/logo.png',
      externalLink: 'https://example.com/profileUrl',
      isExternalLinkVariable: true,
    });

    expect(node.attrs.externalLink).toBe('{{example.com/profileUrl}}');
    expect(node.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(warnings).toContainEqual({
      nodeType: 'inlineImage',
      field: 'isExternalLinkVariable',
      message:
        'Migrated "isExternalLinkVariable" → variable reference in "externalLink"',
    });
  });

  it('drops isExternalLinkVariable without an external link and without a warning', () => {
    const { node, warnings } = getMigratedInlineImage({
      src: 'https://example.com/logo.png',
      externalLink: '',
      isExternalLinkVariable: true,
    });

    expect(node.attrs.externalLink).toBe('');
    expect(node.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(warnings).toEqual([]);
  });

  it('passes width, height, alt and title through', () => {
    const { node } = getMigratedInlineImage({
      src: 'https://example.com/logo.png',
      width: 100,
      height: 40,
      alt: 'Logo',
      title: 'Our logo',
    });

    expect(node.attrs.width).toBe(100);
    expect(node.attrs.height).toBe(40);
    expect(node.attrs.alt).toBe('Logo');
    expect(node.attrs.title).toBe('Our logo');
  });
});
