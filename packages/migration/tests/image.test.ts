import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getImage(attrs: Record<string, any>): Record<string, any> {
  return {
    type: 'doc',
    content: [{ type: 'image', attrs }],
  };
}

function getMigratedImage(attrs: Record<string, any>): Record<string, any> {
  return migrate(getImage(attrs)).json.content[0];
}

const WIDTH_CASES = [
  {
    name: 'converts width "auto" to 100%',
    width: 'auto',
    expected: '100%',
  },
  {
    name: 'converts a pixel width string to a percentage at root level',
    width: '200',
    expected: '33%',
  },
  {
    name: 'converts a numeric width to a percentage',
    width: 300,
    expected: '50%',
  },
  {
    name: 'clamps a width wider than its container to 100%',
    width: 1200,
    expected: '100%',
  },
  {
    name: 'clamps a tiny width to the minimum percentage',
    width: 4,
    expected: '5%',
  },
  {
    name: 'leaves a percentage width untouched',
    width: '42%',
    expected: '42%',
  },
  {
    name: 'leaves an unparseable width untouched',
    width: 'wide',
    expected: 'wide',
  },
];

describe('image', () => {
  it('converts alignment to align', () => {
    const { json, warnings } = migrate(
      getImage({ src: 'img.png', alignment: 'right' })
    );
    const image = json.content[0];

    expect(image.attrs.align).toBe('right');
    expect(image.attrs).not.toHaveProperty('alignment');
    expect(warnings).toContainEqual({
      nodeType: 'image',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
  });

  it('converts borderRadius to style', () => {
    const { json, warnings } = migrate(
      getImage({ src: 'img.png', borderRadius: 12 })
    );
    const image = json.content[0];

    expect(parseInlineStyles(image.attrs.style)).toEqual({
      borderRadius: '12px',
    });
    expect(image.attrs).not.toHaveProperty('borderRadius');
    expect(warnings).toContainEqual({
      nodeType: 'image',
      field: 'borderRadius',
      message: 'Migrated "borderRadius" → "style"',
    });
  });

  it('merges borderRadius over an existing style', () => {
    const image = getMigratedImage({
      src: 'img.png',
      borderRadius: 4,
      style: 'color: red',
    });

    expect(parseInlineStyles(image.attrs.style)).toEqual({
      color: 'red',
      borderRadius: '4px',
    });
  });

  it('drops a zero borderRadius without a style or warning', () => {
    const { json, warnings } = migrate(
      getImage({ src: 'img.png', borderRadius: 0 })
    );
    const image = json.content[0];

    expect(image.attrs).not.toHaveProperty('borderRadius');
    expect(image.attrs).not.toHaveProperty('style');
    expect(warnings).toEqual([]);
  });

  it('does not write a style when nothing produced one', () => {
    const image = getMigratedImage({ src: 'img.png', width: 'auto' });

    expect(image.attrs).not.toHaveProperty('style');
  });

  it.each(WIDTH_CASES)('$name', ({ expected, width }) => {
    const image = getMigratedImage({ src: 'img.png', width });

    expect(image.attrs.width).toBe(expected);
  });

  it('uses context-aware width for an image inside section + column', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { paddingLeft: 50, paddingRight: 50, borderWidth: 0 },
          content: [
            {
              type: 'columns',
              attrs: { gap: 0 },
              content: [
                {
                  type: 'column',
                  attrs: { width: '50%' },
                  content: [
                    { type: 'image', attrs: { src: 'img.png', width: '200' } },
                  ],
                },
                {
                  type: 'column',
                  attrs: { width: '50%' },
                  content: [{ type: 'paragraph', attrs: {} }],
                },
              ],
            },
          ],
        },
      ],
    };

    const { json } = migrate(v1Doc);
    const section = json.content[0];
    const image = section.content[0].content[0].content[0];

    expect(image.attrs.width).toBe('80%');
    expect(image.attrs).not.toHaveProperty('_containerWidth');
  });

  it('does not leak _containerWidth into non-image nodes', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { paddingLeft: 20, paddingRight: 20 },
          content: [
            { type: 'paragraph', attrs: {} },
            { type: 'image', attrs: { src: 'img.png', width: 'auto' } },
          ],
        },
      ],
    };

    const { json } = migrate(v1Doc);
    const section = json.content[0];

    expect(section.attrs).not.toHaveProperty('_containerWidth');
    expect(section.content[0].attrs).not.toHaveProperty('_containerWidth');
    expect(section.content[1].attrs).not.toHaveProperty('_containerWidth');
    expect(section.content[1].attrs.width).toBe('100%');
  });

  it('converts a variable src into a variable reference', () => {
    const { json, warnings } = migrate(
      getImage({ src: 'https://logoUrl', isSrcVariable: true })
    );
    const image = json.content[0];

    expect(image.attrs.src).toBe('{{logoUrl}}');
    expect(image.attrs).not.toHaveProperty('isSrcVariable');
    expect(warnings).toContainEqual({
      nodeType: 'image',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
  });

  it('converts a variable externalLink into a variable reference', () => {
    const { json, warnings } = migrate(
      getImage({
        src: 'img.png',
        externalLink: 'https://ctaUrl',
        isExternalLinkVariable: true,
      })
    );
    const image = json.content[0];

    expect(image.attrs.externalLink).toBe('{{ctaUrl}}');
    expect(image.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(warnings).toContainEqual({
      nodeType: 'image',
      field: 'isExternalLinkVariable',
      message:
        'Migrated "isExternalLinkVariable" → variable reference in "externalLink"',
    });
  });

  it('drops the variable flags when they are false', () => {
    const { json, warnings } = migrate(
      getImage({
        src: 'img.png',
        externalLink: 'https://example.com',
        isSrcVariable: false,
        isExternalLinkVariable: false,
      })
    );
    const image = json.content[0];

    expect(image.attrs.src).toBe('img.png');
    expect(image.attrs.externalLink).toBe('https://example.com');
    expect(image.attrs).not.toHaveProperty('isSrcVariable');
    expect(image.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(warnings).toEqual([]);
  });

  it('drops isExternalLinkVariable when there is no externalLink', () => {
    const { json, warnings } = migrate(
      getImage({ src: 'img.png', isExternalLinkVariable: true })
    );
    const image = json.content[0];

    expect(image.attrs).not.toHaveProperty('isExternalLinkVariable');
    expect(warnings).toEqual([]);
  });

  it('drops unsupported attributes with warnings', () => {
    const { json, warnings } = migrate(
      getImage({
        src: 'img.png',
        height: 120,
        lockAspectRatio: true,
        aspectRatio: '16/9',
      })
    );
    const image = json.content[0];

    expect(image.attrs).not.toHaveProperty('height');
    expect(image.attrs).not.toHaveProperty('lockAspectRatio');
    expect(image.attrs).not.toHaveProperty('aspectRatio');
    expect(warnings).toEqual([
      {
        nodeType: 'image',
        field: 'height',
        message: 'Attribute "height" is not supported in v2 and was dropped',
      },
      {
        nodeType: 'image',
        field: 'lockAspectRatio',
        message:
          'Attribute "lockAspectRatio" is not supported in v2 and was dropped',
      },
      {
        nodeType: 'image',
        field: 'aspectRatio',
        message:
          'Attribute "aspectRatio" is not supported in v2 and was dropped',
      },
    ]);
  });

  it('does not write border attributes', () => {
    const image = getMigratedImage({
      src: 'img.png',
      width: '200',
      borderRadius: 8,
    });

    expect(Object.keys(image.attrs).sort()).toEqual(['src', 'style', 'width']);
  });
});
