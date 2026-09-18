import { roundTo } from './math';

export type ColumnWidth = number | string;

const PERCENTAGE_PATTERN = /^(\d+(?:\.\d+)?)%$/;
const PIXEL_PATTERN = /^(\d+(?:\.\d+)?)px$/;
const CSS_LENGTH_PATTERN =
  /^\d+(?:\.\d+)?(?:px|pt|pc|in|cm|mm|em|rem|ex|ch|vw|vh|vmin|vmax)$/;

export function getColumnWidth(
  value: string | null | undefined
): ColumnWidth | null {
  const declaration = value?.trim();
  if (!declaration) {
    return null;
  }

  const percentage = PERCENTAGE_PATTERN.exec(declaration);
  if (percentage) {
    return Number(percentage[1]);
  }

  return CSS_LENGTH_PATTERN.test(declaration) ? declaration : null;
}

export function getColumnWidthValue(width: ColumnWidth): string {
  return typeof width === 'number' ? `${width}%` : width;
}

type ColumnWidthPercentOptions = {
  containerWidth: number;
  width: ColumnWidth | null | undefined;
};

export function getColumnWidthPercent(
  options: ColumnWidthPercentOptions
): number | null {
  const { containerWidth, width } = options;

  if (width === null || width === undefined) {
    return null;
  }

  if (typeof width === 'number') {
    return width;
  }

  const percentage = PERCENTAGE_PATTERN.exec(width);
  if (percentage) {
    return Number(percentage[1]);
  }

  const pixels = PIXEL_PATTERN.exec(width);
  if (pixels && containerWidth > 0) {
    return roundTo((Number(pixels[1]) / containerWidth) * 100, 3);
  }

  return null;
}
