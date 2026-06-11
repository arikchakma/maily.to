import { clamp } from './math';

/**
 * Represents an image width value — can be a pixel number, a percentage
 * string (e.g. "50%"), or the literal "auto" for full-width.
 */
export type ImageWidth = number | string;

export const MIN_IMAGE_WIDTH_PERCENTAGE = 5;
export const MAX_IMAGE_WIDTH_PERCENTAGE = 100;

const MAX_IMAGE_WIDTH_PIXELS = 600;

/**
 * Converts any ImageWidth value to a clamped percentage number.
 * Handles "auto" (→ 100), percentage strings (e.g. "50%" → 50),
 * and legacy pixel numbers (converted relative to maxWidthPixels).
 * Returns 100 for null or unrecognized values.
 */
export function parseWidthToPercentage(
  width: ImageWidth | null,
  maxWidthPixels: number = MAX_IMAGE_WIDTH_PIXELS
): number {
  if (typeof width === 'string') {
    if (width === 'auto') {
      return 100;
    }

    return width.endsWith('%')
      ? clampImageWidthPercentage(parseInt(width))
      : 100;
  }

  // it's here for backwards compatibility
  // use string instead of fixed number
  if (typeof width === 'number') {
    const percentage = Math.round((100 * width) / maxWidthPixels);
    return clampImageWidthPercentage(percentage);
  }

  return 100;
}

export function clampImageWidthPercentage(width: number) {
  return clamp(width, [MIN_IMAGE_WIDTH_PERCENTAGE, MAX_IMAGE_WIDTH_PERCENTAGE]);
}
