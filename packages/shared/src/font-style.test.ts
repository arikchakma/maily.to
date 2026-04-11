import { describe, expect, it } from 'vite-plus/test';

import { FONT_STYLES, getFontStyle } from './font-style';
import { FONT_WEIGHTS } from './font-weight';
import { getNodeFontStyleDefaults } from './theme';

describe('getNodeFontStyleDefaults', () => {
  it('returns paragraph defaults for "paragraph"', () => {
    expect(getNodeFontStyleDefaults('paragraph')).toEqual({
      fontSize: 15,
      lineHeight: 1.75,
      fontWeight: FONT_WEIGHTS.NORMAL,
    });
  });

  it('returns heading level 1 defaults by default', () => {
    expect(getNodeFontStyleDefaults('heading')).toEqual({
      fontSize: 36,
      lineHeight: 1.1111111,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    });
  });

  it('returns heading level 2 defaults', () => {
    expect(getNodeFontStyleDefaults('heading', 2)).toEqual({
      fontSize: 30,
      lineHeight: 1.3333333,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    });
  });

  it('returns heading level 3 defaults', () => {
    expect(getNodeFontStyleDefaults('heading', 3)).toEqual({
      fontSize: 24,
      lineHeight: 1.6,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    });
  });

  it('returns button defaults', () => {
    expect(getNodeFontStyleDefaults('button')).toEqual({
      fontSize: 14,
      lineHeight: 1.4285714,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    });
  });

  it('returns blockquote defaults with fontStyle', () => {
    const result = getNodeFontStyleDefaults('blockquote');
    expect(result).toEqual({
      fontSize: 15,
      lineHeight: 1.75,
      fontWeight: FONT_WEIGHTS.MEDIUM,
      fontStyle: FONT_STYLES.ITALIC,
    });
    expect(result.fontStyle).toBe(FONT_STYLES.ITALIC);
  });

  it('returns footer defaults', () => {
    expect(getNodeFontStyleDefaults('footer')).toEqual({
      fontSize: 14,
      lineHeight: 1.7142857,
      fontWeight: FONT_WEIGHTS.NORMAL,
    });
  });

  it('falls back to paragraph defaults for unknown types', () => {
    expect(getNodeFontStyleDefaults('unknown')).toEqual({
      fontSize: 15,
      lineHeight: 1.75,
      fontWeight: FONT_WEIGHTS.NORMAL,
    });
  });
});

describe('getFontStyle', () => {
  it('returns full font style properties', () => {
    const result = getFontStyle({
      fontFamily: 'Inter',
      fontFallback: 'sans-serif',
      fontSize: 16,
      fontWeight: FONT_WEIGHTS.BOLD,
      lineHeight: 1.5,
      fontStyle: FONT_STYLES.ITALIC,
    });

    expect(result).toEqual({
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      fontWeight: FONT_WEIGHTS.BOLD,
      lineHeight: 1.5,
      fontStyle: 'italic',
    });
  });

  it('omits null properties', () => {
    const result = getFontStyle({
      fontFamily: null,
      fontFallback: null,
      fontSize: null,
      fontWeight: null,
      lineHeight: null,
      fontStyle: null,
    });

    expect(result).toEqual({});
  });

  it('includes only fontFamily when fallback is null', () => {
    const result = getFontStyle({
      fontFamily: 'Georgia',
      fontFallback: null,
      fontSize: null,
      fontWeight: null,
      lineHeight: null,
      fontStyle: null,
    });

    expect(result).toEqual({ fontFamily: 'Georgia' });
  });

  it('includes only fallback when fontFamily is null', () => {
    const result = getFontStyle({
      fontFamily: null,
      fontFallback: 'serif',
      fontSize: null,
      fontWeight: null,
      lineHeight: null,
      fontStyle: null,
    });

    expect(result).toEqual({ fontFamily: 'serif' });
  });

  it('handles fontSize of 0', () => {
    const result = getFontStyle({
      fontFamily: null,
      fontFallback: null,
      fontSize: 0,
      fontWeight: null,
      lineHeight: null,
      fontStyle: null,
    });

    expect(result).toEqual({ fontSize: '0px' });
  });
});
