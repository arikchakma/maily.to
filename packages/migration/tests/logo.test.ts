import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getLogo(attrs: Record<string, any>): Record<string, any> {
  return {
    type: 'doc',
    content: [{ type: 'logo', attrs }],
  };
}

function getMigratedLogo(attrs: Record<string, any>): Record<string, any> {
  return migrate(getLogo(attrs)).json.content[0];
}

const SIZE_CASES = [
  { name: 'converts size sm to a percentage width', size: 'sm', width: '7%' },
  { name: 'converts size md to a percentage width', size: 'md', width: '8%' },
  { name: 'converts size lg to a percentage width', size: 'lg', width: '11%' },
  {
    name: 'falls back to the medium size for an unknown size',
    size: 'xl',
    width: '8%',
  },
];

describe('logo', () => {
  it('converts the node type to image', () => {
    const logo = getMigratedLogo({ src: 'logo.png' });

    expect(logo.type).toBe('image');
  });

  it.each(SIZE_CASES)('$name', ({ size, width }) => {
    const { json, warnings } = migrate(getLogo({ src: 'logo.png', size }));
    const logo = json.content[0];

    expect(logo.attrs.width).toBe(width);
    expect(logo.attrs).not.toHaveProperty('size');
    expect(warnings).toContainEqual({
      nodeType: 'logo',
      field: 'size',
      message: `Migrated "size: ${size}" → "width: ${width}"`,
    });
  });

  it('leaves width unset when there is no size', () => {
    const logo = getMigratedLogo({ src: 'logo.png' });

    expect(logo.attrs).not.toHaveProperty('width');
  });

  it('uses context-aware width for a logo inside a column', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'columns',
          attrs: { gap: 0 },
          content: [
            {
              type: 'column',
              attrs: { width: '50%' },
              content: [
                {
                  type: 'logo',
                  attrs: { src: 'logo.png', size: 'lg', alignment: 'center' },
                },
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
    };

    const { json } = migrate(v1Doc);
    const logo = json.content[0].content[0].content[0];

    expect(logo.type).toBe('image');
    expect(logo.attrs.width).toBe('21%');
    expect(logo.attrs.align).toBe('center');
    expect(logo.attrs).not.toHaveProperty('size');
    expect(logo.attrs).not.toHaveProperty('_containerWidth');
  });

  it('converts alignment to align', () => {
    const { json, warnings } = migrate(
      getLogo({ src: 'logo.png', alignment: 'left' })
    );
    const logo = json.content[0];

    expect(logo.attrs.align).toBe('left');
    expect(logo.attrs).not.toHaveProperty('alignment');
    expect(warnings).toContainEqual({
      nodeType: 'logo',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
  });

  it('converts a variable src into a variable reference', () => {
    const { json, warnings } = migrate(
      getLogo({ src: 'https://logoUrl', isSrcVariable: true })
    );
    const logo = json.content[0];

    expect(logo.attrs.src).toBe('{{logoUrl}}');
    expect(logo.attrs).not.toHaveProperty('isSrcVariable');
    expect(warnings).toContainEqual({
      nodeType: 'logo',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
  });

  it('drops isSrcVariable when it is false', () => {
    const { json, warnings } = migrate(
      getLogo({ src: 'logo.png', isSrcVariable: false })
    );
    const logo = json.content[0];

    expect(logo.attrs.src).toBe('logo.png');
    expect(logo.attrs).not.toHaveProperty('isSrcVariable');
    expect(warnings).toEqual([]);
  });

  it('drops the maily-component marker with a warning', () => {
    const { json, warnings } = migrate(
      getLogo({ src: 'logo.png', 'maily-component': 'logo' })
    );
    const logo = json.content[0];

    expect(logo.attrs).not.toHaveProperty('maily-component');
    expect(warnings).toContainEqual({
      nodeType: 'logo',
      field: 'maily-component',
      message:
        'Attribute "maily-component" is not supported in v2 and was dropped',
    });
  });

  it('does not write border or style attributes', () => {
    const logo = getMigratedLogo({
      src: 'logo.png',
      size: 'lg',
      alignment: 'center',
      'maily-component': 'logo',
    });

    expect(Object.keys(logo.attrs).sort()).toEqual(['align', 'src', 'width']);
  });
});
