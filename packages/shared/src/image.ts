import { clamp } from './math';

export type ImageWidth = number | string;

export const MIN_IMAGE_WIDTH_PERCENTAGE = 5;
export const MAX_IMAGE_WIDTH_PERCENTAGE = 100;

export const DEFAULT_CONTAINER_WIDTH_PIXELS = 600;

const PIXEL_SUFFIX = 'px';

function getPixels(value: string) {
  const length = value.endsWith(PIXEL_SUFFIX)
    ? value.slice(0, -PIXEL_SUFFIX.length)
    : value;

  if (length === '') {
    return null;
  }

  const pixels = Number(length);

  return Number.isFinite(pixels) ? pixels : null;
}

export function parseWidthToPercentage(
  width: ImageWidth | null | undefined,
  containerWidthPixels: number = DEFAULT_CONTAINER_WIDTH_PIXELS
): number {
  if (width === null || width === undefined || width === 'auto') {
    return MAX_IMAGE_WIDTH_PERCENTAGE;
  }

  const value = String(width).trim();
  if (value.endsWith('%')) {
    return clampImageWidthPercentage(Number.parseFloat(value));
  }

  const pixels = getPixels(value);
  if (pixels === null) {
    return MAX_IMAGE_WIDTH_PERCENTAGE;
  }

  return clampImageWidthPercentage(
    Math.round((100 * pixels) / containerWidthPixels)
  );
}

export function clampImageWidthPercentage(width: number) {
  return clamp(width, [MIN_IMAGE_WIDTH_PERCENTAGE, MAX_IMAGE_WIDTH_PERCENTAGE]);
}
