import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';
import type { MigrationWarning } from '../src/types';

type MigratedButton = {
  attrs: Record<string, any>;
  content?: Record<string, any>[];
  warnings: MigrationWarning[];
};

function getMigratedButton(attrs: Record<string, any>): MigratedButton {
  const result = migrate({
    type: 'doc',
    content: [{ type: 'button', attrs }],
  });
  const node = result.json.content[0];

  return {
    attrs: node.attrs,
    content: node.content,
    warnings: result.warnings,
  };
}

describe('button', () => {
  it('moves text into inline content', () => {
    const { attrs, content, warnings } = getMigratedButton({
      text: 'Subscribe',
      url: 'https://example.com',
    });

    expect(content).toEqual([{ type: 'text', text: 'Subscribe' }]);
    expect(attrs).not.toHaveProperty('text');
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'text',
      message: 'Migrated "text" → inline content node',
    });
  });

  it('moves variable text into a variable content node', () => {
    const { attrs, content, warnings } = getMigratedButton({
      text: 'userName',
      isTextVariable: true,
      url: 'https://example.com',
    });

    expect(content).toEqual([{ type: 'variable', attrs: { id: 'userName' } }]);
    expect(attrs).not.toHaveProperty('isTextVariable');
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'isTextVariable',
      message: 'Migrated "isTextVariable" → variable content node',
    });
  });

  it('writes no content for an empty text', () => {
    const { content } = getMigratedButton({ text: '' });

    expect(content).toBeUndefined();
  });

  it('converts a url variable into a variable reference', () => {
    const { attrs, warnings } = getMigratedButton({
      text: 'Click',
      url: 'https://userProfile',
      isUrlVariable: true,
    });

    expect(attrs.url).toBe('{{userProfile}}');
    expect(attrs).not.toHaveProperty('isUrlVariable');
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'isUrlVariable',
      message: 'Migrated "isUrlVariable" → variable reference in "url"',
    });
  });

  it('drops a false url variable flag quietly', () => {
    const { attrs, warnings } = getMigratedButton({
      url: 'https://example.com',
      isUrlVariable: false,
    });

    expect(attrs.url).toBe('https://example.com');
    expect(attrs).not.toHaveProperty('isUrlVariable');
    expect(warnings).toEqual([]);
  });

  it('renames alignment to align', () => {
    const { attrs, warnings } = getMigratedButton({ alignment: 'center' });

    expect(attrs.align).toBe('center');
    expect(attrs).not.toHaveProperty('alignment');
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
  });

  it('writes the v1 left align default when alignment is absent', () => {
    const { attrs } = getMigratedButton({ url: 'https://example.com' });

    expect(attrs.align).toBe('left');
  });

  it('converts filled button colours into style declarations', () => {
    const { attrs, warnings } = getMigratedButton({
      buttonColor: '#000000',
      textColor: '#ffffff',
      variant: 'filled',
    });

    expect(parseInlineStyles(attrs.style)).toEqual({
      backgroundColor: '#000000',
      color: '#ffffff',
    });
    expect(attrs).not.toHaveProperty('buttonColor');
    expect(attrs).not.toHaveProperty('textColor');
    expect(attrs).not.toHaveProperty('variant');
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'buttonColor',
      message: 'Migrated "buttonColor" → "style"',
    });
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'textColor',
      message: 'Migrated "textColor" → "style"',
    });
  });

  it('converts an outline variant into a transparent background and a border', () => {
    const { attrs, warnings } = getMigratedButton({
      buttonColor: '#0066ff',
      variant: 'outline',
    });

    expect(parseInlineStyles(attrs.style)).toEqual({
      backgroundColor: 'transparent',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#0066ff',
    });
    expect(warnings).toContainEqual({
      nodeType: 'button',
      field: 'variant',
      message:
        'Migrated "variant: outline" → transparent background + border in "style"',
    });
    expect(warnings).not.toContainEqual({
      nodeType: 'button',
      field: 'buttonColor',
      message: 'Migrated "buttonColor" → "style"',
    });
  });

  it('falls back to black for an outline variant without a button colour', () => {
    const { attrs } = getMigratedButton({
      variant: 'outline',
      buttonColor: null,
    });

    expect(parseInlineStyles(attrs.style)).toEqual({
      backgroundColor: 'transparent',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#000000',
    });
  });

  it('converts each border radius enum into a pixel value', () => {
    const radii = {
      sharp: '0px',
      smooth: '6px',
      round: '9999px',
      squircle: '9999px',
    };

    for (const [borderRadius, expected] of Object.entries(radii)) {
      const { attrs, warnings } = getMigratedButton({ borderRadius });

      expect(parseInlineStyles(attrs.style)).toEqual({
        borderRadius: expected,
      });
      expect(attrs).not.toHaveProperty('borderRadius');
      expect(warnings).toContainEqual({
        nodeType: 'button',
        field: 'borderRadius',
        message: 'Migrated "borderRadius" enum → "style"',
      });
    }
  });

  it('converts the padding sides it was given', () => {
    const { attrs, warnings } = getMigratedButton({
      paddingTop: 10,
      paddingRight: null,
      paddingBottom: 0,
      paddingLeft: 24,
    });

    expect(parseInlineStyles(attrs.style)).toEqual({
      paddingTop: '10px',
      paddingBottom: '0px',
      paddingLeft: '24px',
    });
    expect(attrs).not.toHaveProperty('paddingTop');
    expect(attrs).not.toHaveProperty('paddingRight');
    expect(attrs).not.toHaveProperty('paddingBottom');
    expect(attrs).not.toHaveProperty('paddingLeft');
    expect(warnings).toEqual([]);
  });

  it('merges declarations over an existing style', () => {
    const { attrs } = getMigratedButton({
      style: 'font-weight:600',
      buttonColor: '#000000',
      borderRadius: 'smooth',
    });

    expect(parseInlineStyles(attrs.style)).toEqual({
      fontWeight: '600',
      backgroundColor: '#000000',
      borderRadius: '6px',
    });
  });

  it('writes no style when the v1 defaults carry no styling', () => {
    const { attrs, warnings } = getMigratedButton({
      url: 'https://example.com',
      buttonColor: null,
      textColor: null,
      paddingTop: null,
      paddingRight: null,
      paddingBottom: null,
      paddingLeft: null,
    });

    expect(attrs).not.toHaveProperty('style');
    expect(warnings).toEqual([]);
  });

  it('defaults kind to tight and keeps an existing kind', () => {
    expect(getMigratedButton({}).attrs.kind).toBe('tight');
    expect(getMigratedButton({ kind: 'full-width' }).attrs.kind).toBe(
      'full-width'
    );
  });

  it('writes none of the beta button attributes', () => {
    const { attrs } = getMigratedButton({
      text: 'Click',
      buttonColor: '#0066ff',
      textColor: '#ffffff',
      variant: 'outline',
      borderRadius: 'round',
      paddingTop: 10,
      paddingRight: 24,
      paddingBottom: 10,
      paddingLeft: 24,
    });

    expect(attrs).not.toHaveProperty('borderTopLeftRadius');
    expect(attrs).not.toHaveProperty('paddingMode');
    expect(attrs).not.toHaveProperty('borderStyle');
    expect(attrs).not.toHaveProperty('borderColor');
    expect(attrs).not.toHaveProperty('backgroundColor');
    expect(attrs).not.toHaveProperty('color');
    expect(attrs).not.toHaveProperty('borderRadiusMode');
    expect(attrs).not.toHaveProperty('borderWidthMode');
    expect(attrs).not.toHaveProperty('borderTopWidth');
  });

  it('reports every migrated attribute in order', () => {
    const { warnings } = getMigratedButton({
      text: 'Subscribe',
      isTextVariable: false,
      url: 'https://example.com',
      isUrlVariable: true,
      alignment: 'center',
      variant: 'filled',
      borderRadius: 'round',
      buttonColor: '#000000',
      textColor: '#ffffff',
    });

    expect(warnings).toEqual([
      {
        nodeType: 'button',
        field: 'text',
        message: 'Migrated "text" → inline content node',
      },
      {
        nodeType: 'button',
        field: 'isTextVariable',
        message: 'Migrated "isTextVariable" → variable content node',
      },
      {
        nodeType: 'button',
        field: 'isUrlVariable',
        message: 'Migrated "isUrlVariable" → variable reference in "url"',
      },
      {
        nodeType: 'button',
        field: 'alignment',
        message: 'Migrated "alignment" → "align"',
      },
      {
        nodeType: 'button',
        field: 'buttonColor',
        message: 'Migrated "buttonColor" → "style"',
      },
      {
        nodeType: 'button',
        field: 'textColor',
        message: 'Migrated "textColor" → "style"',
      },
      {
        nodeType: 'button',
        field: 'borderRadius',
        message: 'Migrated "borderRadius" enum → "style"',
      },
    ]);
  });
});
