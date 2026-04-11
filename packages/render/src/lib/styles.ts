import type { CSSProperties } from 'react';

/**
 * Cross-browser font smoothing properties. Applied to the document
 * root so all text renders with subpixel antialiasing disabled.
 */
export const ANTIALIASED: Pick<
  CSSProperties,
  'WebkitFontSmoothing' | 'MozOsxFontSmoothing'
> = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};
