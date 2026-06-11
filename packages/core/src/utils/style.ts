import { objectify } from 'stylecast';

/**
 * Parses an element's inline `style` attribute into a camelCase object.
 * Returns an empty object if no style attribute is present.
 */
export function parseInlineStyles(element: HTMLElement) {
  const styleAttr = element.getAttribute('style');
  if (!styleAttr) {
    return {};
  }

  return objectify(styleAttr, { camelCase: true });
}

/**
 * Splits a CSS font-family string into an array of font names,
 * stripping quotes and whitespace.
 */
export function parseFontFamilyToArray(fontFamilyValue: string): string[] {
  return fontFamilyValue
    .split(',')
    .map((font) => font.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}
