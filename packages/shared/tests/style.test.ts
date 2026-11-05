import { describe, expect, it } from 'vite-plus/test';

import {
  mergeInlineStyles,
  parseInlineStyles,
  stringifyInlineStyles,
} from '../src/index';

describe('inline styles', () => {
  describe('mergeInlineStyles', () => {
    it('keeps a layered longhand from being reset by the shorthand under it', () => {
      const theme = { border: '2px solid #e2e2e2', padding: '8px' };
      const authored = { borderTopWidth: '1px', paddingLeft: '40px' };

      expect(mergeInlineStyles(theme, authored)).toEqual({
        borderColor: '#e2e2e2',
        borderStyle: 'solid',
        borderWidth: '1px 2px 2px',
        padding: '8px 8px 8px 40px',
      });
    });

    it('layers a shorthand over a longhand without either order mattering', () => {
      const under = { paddingLeft: '40px' };
      const over = { padding: '8px' };

      expect(mergeInlineStyles(under, over)).toEqual({ padding: '8px' });
    });

    it('keeps a layered longhand the shorthand beneath it would have reset', () => {
      const under = { paddingLeft: '4px', padding: '8px' };
      const over = { paddingLeft: '40px' };

      expect(stringifyInlineStyles(mergeInlineStyles(under, over))).toBe(
        'padding:8px 8px 8px 40px'
      );
    });

    it('leaves a style with nothing to layer unchanged', () => {
      const style = { color: '#18181b', fontSize: '14px' };

      expect(mergeInlineStyles(style, {})).toEqual(style);
    });
  });

  it('converts arbitrary inline CSS into React-compatible style properties', () => {
    const style = parseInlineStyles(
      'font-size:14px;line-height:24px;background:linear-gradient(90deg, #f8fafc, #ffffff);color:#0f172a;margin:12px 8px 4px;padding:6px 10px;-webkit-font-smoothing:antialiased;--brand-accent:#7c3aed;--maily-unknown-property:preserved'
    );

    expect(style).toEqual({
      '--brand-accent': '#7c3aed',
      '--maily-unknown-property': 'preserved',
      WebkitFontSmoothing: 'antialiased',
      background: 'linear-gradient(90deg, #f8fafc, #ffffff)',
      color: '#0f172a',
      fontSize: '14px',
      lineHeight: '24px',
      margin: '12px 8px 4px',
      padding: '6px 10px',
    });
  });

  it('serializes React-compatible styles without losing declarations', () => {
    const input =
      'background:linear-gradient(90deg, #f8fafc, #ffffff);-webkit-font-smoothing:antialiased;--brand-accent:#7c3aed;unknown-property:preserved';
    const serialized = stringifyInlineStyles(parseInlineStyles(input));

    expect(parseInlineStyles(serialized)).toEqual(parseInlineStyles(input));
  });
});
