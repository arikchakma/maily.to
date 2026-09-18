import { describe, expect, it } from 'vite-plus/test';

import {
  DEFAULT_FONT,
  DEFAULT_NODE_THEME,
  getFontFaceStyle,
  getFontFamilyNames,
  getFontFamilyValue,
} from '../src/index';

describe('font', () => {
  describe('getFontFamilyValue', () => {
    it('quotes the primary family and leaves the fallback bare', () => {
      expect(
        getFontFamilyValue({
          fallbackFontFamily: 'sans-serif',
          fontFamily: 'Open Sans',
        })
      ).toBe("'Open Sans', sans-serif");
    });

    it('drops the half that is missing', () => {
      expect({
        familyOnly: getFontFamilyValue({ fontFamily: 'Inter' }),
        fallbackOnly: getFontFamilyValue({ fallbackFontFamily: 'serif' }),
        neither: getFontFamilyValue({}),
      }).toEqual({
        fallbackOnly: 'serif',
        familyOnly: "'Inter'",
        neither: '',
      });
    });
  });

  describe('getFontFaceStyle', () => {
    it('carries the web font source into the font face rule', () => {
      expect(getFontFaceStyle(DEFAULT_FONT)).toBe(
        "@font-face {font-family: 'Inter';font-style: normal;font-weight: 400;mso-font-alt: 'sans-serif';src: url(https://cdn.usemaily.com/fonts/v0/inter.woff2) format('woff2');}"
      );
    });

    it('leaves out the source when the font has no web font', () => {
      expect(
        getFontFaceStyle({
          fallbackFontFamily: 'sans-serif',
          fontFamily: 'Arial',
        })
      ).toBe(
        "@font-face {font-family: 'Arial';font-style: normal;font-weight: 400;mso-font-alt: 'sans-serif';}"
      );
    });
  });

  it('reads an authored declaration back into its families', () => {
    expect(getFontFamilyNames(`"Open Sans", 'Helvetica' , sans-serif`)).toEqual(
      ['Open Sans', 'Helvetica', 'sans-serif']
    );
  });

  it('authors the font on the body of the default theme', () => {
    expect(DEFAULT_NODE_THEME.body).toEqual({
      fontFamily: "'Inter', sans-serif",
    });
  });
});
