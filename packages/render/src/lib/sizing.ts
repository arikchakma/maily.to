import type { InlineStyle } from '@maily-to/shared';

import type { BoxModel } from '../context';

export function parsePxValue(value: string | number | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const trimmed = value.trim();
  if (trimmed.endsWith('px')) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export function initSize(totalWidth: number): BoxModel {
  return { totalWidth, totalBorder: 0, totalPadding: 0 };
}

type CssValue = string | number | undefined;

type InsetBoxSpacing = {
  borderLeft: CssValue;
  borderRight: CssValue;
  paddingLeft: CssValue;
  paddingRight: CssValue;
};

function insetBox(size: BoxModel, spacing: InsetBoxSpacing): BoxModel {
  return {
    totalWidth: size.totalWidth,
    totalBorder:
      size.totalBorder +
      parsePxValue(spacing.borderLeft) +
      parsePxValue(spacing.borderRight),
    totalPadding:
      size.totalPadding +
      parsePxValue(spacing.paddingLeft) +
      parsePxValue(spacing.paddingRight),
  };
}

function getShorthandSide(value: string | undefined, side: 'left' | 'right') {
  const parts = value?.trim().split(/\s+/);
  if (!parts?.length) {
    return undefined;
  }

  return side === 'right'
    ? (parts[1] ?? parts[0])
    : (parts[3] ?? parts[1] ?? parts[0]);
}

function getBorderShorthandWidth(border: string | undefined) {
  return border
    ?.trim()
    .split(/\s+/)
    .find((token) => token.endsWith('px'));
}

export function insetXFromStyle(
  size: BoxModel,
  style: InlineStyle | undefined
): BoxModel {
  const border = getBorderShorthandWidth(style?.border);

  return insetBox(size, {
    borderLeft:
      style?.borderLeftWidth ??
      getShorthandSide(style?.borderWidth, 'left') ??
      border,
    borderRight:
      style?.borderRightWidth ??
      getShorthandSide(style?.borderWidth, 'right') ??
      border,
    paddingLeft: style?.paddingLeft ?? getShorthandSide(style?.padding, 'left'),
    paddingRight:
      style?.paddingRight ?? getShorthandSide(style?.padding, 'right'),
  });
}
