import type { BoxModel } from '../context';

/**
 * Extracts a numeric pixel value from a CSS string (e.g. "12px" → 12).
 * Returns 0 for undefined, non-px strings, or NaN results.
 */
export function parsePxValue(value: string | number | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const trimmed = value.trim();
  if (trimmed.endsWith('px')) {
    const n = parseFloat(trimmed);
    return isNaN(n) ? 0 : n;
  }

  return 0;
}

/**
 * Creates a fresh BoxModel with the given total width and zero
 * border/padding. Used as the starting point for layout calculations.
 */
export function initSize(totalWidth: number): BoxModel {
  return { totalWidth, totalBorder: 0, totalPadding: 0 };
}

type CssValue = string | number | undefined;

type InsetBoxSpacing = {
  paddingLeft: CssValue;
  paddingRight: CssValue;
  borderLeft: CssValue;
  borderRight: CssValue;
};

/**
 * Accumulates horizontal border and padding into a BoxModel.
 * The total width stays the same — the usable content area shrinks.
 */
export function insetBox(size: BoxModel, spacing: InsetBoxSpacing): BoxModel {
  const totalBorder =
    size.totalBorder +
    parsePxValue(spacing.borderLeft) +
    parsePxValue(spacing.borderRight);
  const totalPadding =
    size.totalPadding +
    parsePxValue(spacing.paddingLeft) +
    parsePxValue(spacing.paddingRight);
  return { totalWidth: size.totalWidth, totalBorder, totalPadding };
}

/**
 * Creates a narrower BoxModel for percentage-width children (columns).
 * Computes the child's total width from the parent's content area,
 * subtracting horizontal gap space.
 */
export function narrowBoxByPercent(
  size: BoxModel,
  widthPercent: number,
  gapH: number
): BoxModel {
  const currentBox = size.totalWidth - size.totalBorder - size.totalPadding;
  const totalWidth = currentBox * (widthPercent / 100) - gapH;
  return { totalWidth, totalBorder: 0, totalPadding: 0 };
}
