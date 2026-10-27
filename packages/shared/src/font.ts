import type { Properties } from 'csstype';

/**
 * List of allowed fallback font families. These are system fonts or
 * generic font families that serve as fallbacks when a web font
 * fails to load.
 */
export const allowedFallbackFonts = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
] as const;

export type FallbackFont = (typeof allowedFallbackFonts)[number];

const allowedFontFormats = [
  'woff',
  'woff2',
  'truetype',
  'opentype',
  'embedded-opentype',
  'svg',
] as const;

export type FontFormat = (typeof allowedFontFormats)[number];

type FontStyle = Properties['fontStyle'];

/**
 * Configuration for a font used in the editor or renderer.
 * Specifies the primary font family, a fallback, and an optional
 * web font URL with its format for @font-face loading.
 */
export interface FontProps {
  fontFamily: string;
  fallbackFontFamily: FallbackFont;
  webFont?: {
    url: string;
    format: FontFormat;
  };
  fontStyle?: FontStyle;
  fontWeight?: number;
}

/**
 * Default font configuration: Inter with sans-serif fallback,
 * loaded from the Maily CDN as woff2.
 */
export const DEFAULT_FONT: FontProps = {
  fallbackFontFamily: 'sans-serif',
  fontFamily: 'Inter',
  webFont: {
    format: 'woff2',
    url: 'https://cdn.usemaily.com/fonts/v0/inter.woff2',
  },
};

export function getFontFamilyNames(value: string): string[] {
  return value
    .split(',')
    .map((font) => {
      return font.trim().replace(/['"]/g, '');
    })
    .filter(Boolean);
}

export type FontFamilyValueOptions = {
  fallbackFontFamily?: string | null;
  fontFamily?: string | null;
};

export function getFontFamilyValue(options: FontFamilyValueOptions): string {
  const { fallbackFontFamily, fontFamily } = options;

  return [fontFamily ? `'${fontFamily}'` : null, fallbackFontFamily]
    .filter(Boolean)
    .join(', ');
}

/**
 * Generates a @font-face CSS rule string for the given font configuration.
 * Includes the font family, style, weight, MSO fallback, and web font
 * source URL when available.
 */
export function getFontFaceStyle(font: FontProps): string {
  const {
    fallbackFontFamily,
    fontFamily,
    fontStyle = 'normal',
    fontWeight = 400,
    webFont,
  } = font;

  const src = webFont
    ? `src: url(${webFont.url}) format('${webFont.format}');`
    : '';

  return /* css */ `@font-face {font-family: '${fontFamily}';font-style: ${fontStyle};font-weight: ${fontWeight};mso-font-alt: '${fallbackFontFamily}';${src}}`;
}

/**
 * Injects a @font-face style element into the document head to load
 * the given font. Only works in browser environments.
 */
export function loadFont(font: FontProps): void {
  const styleElement = document.createElement('style');
  styleElement.textContent = getFontFaceStyle(font);
  document.head.appendChild(styleElement);
}
