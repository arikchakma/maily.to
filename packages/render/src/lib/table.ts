import type { AnyMailyNode, InlineStyle } from '@maily-to/shared';

import { getNodeStyle } from './styles';

const ALIGNMENTS = ['center', 'justify', 'left', 'right'];
const VERTICAL_ALIGNMENTS = ['baseline', 'bottom', 'middle', 'top'];

type PresentationalAttributes = Record<string, string | undefined>;

function toAttributeLength(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    return trimmed;
  }

  return trimmed.endsWith('px') ? trimmed.slice(0, -2) : undefined;
}

function toAllowedKeyword(value: string | undefined, allowed: string[]) {
  return value && allowed.includes(value) ? value : undefined;
}

function getTableAlignment(style: InlineStyle) {
  const left = style.marginLeft === 'auto';
  const right = style.marginRight === 'auto';

  if (left && right) {
    return 'center';
  }

  if (left) {
    return 'right';
  }

  return right ? 'left' : undefined;
}

export function getTableAttributes(
  style: InlineStyle | undefined
): PresentationalAttributes {
  if (!style) {
    return {};
  }

  return {
    align: getTableAlignment(style),
    bgcolor: style.backgroundColor,
    width: toAttributeLength(style.width),
  };
}

export function getRowAttributes(
  style: InlineStyle | undefined
): PresentationalAttributes {
  if (!style) {
    return {};
  }

  return {
    align: toAllowedKeyword(style.textAlign, ALIGNMENTS),
    bgcolor: style.backgroundColor,
    valign: toAllowedKeyword(style.verticalAlign, VERTICAL_ALIGNMENTS),
  };
}

export function getCellAttributes(
  style: InlineStyle | undefined
): PresentationalAttributes {
  if (!style) {
    return {};
  }

  return {
    align: toAllowedKeyword(style.textAlign, ALIGNMENTS),
    bgcolor: style.backgroundColor,
    height: toAttributeLength(style.height),
    valign: toAllowedKeyword(style.verticalAlign, VERTICAL_ALIGNMENTS),
    width: toAttributeLength(style.width),
  };
}

function getDeclaredWidth(style: InlineStyle | undefined, box: number) {
  const width = style?.width?.trim();
  if (!width) {
    return null;
  }

  const value = Number.parseFloat(width);
  if (Number.isNaN(value)) {
    return null;
  }

  if (width.endsWith('%')) {
    return (box * value) / 100;
  }

  return width.endsWith('px') ? value : null;
}

export function getCellWidths(cells: AnyMailyNode[], box: number): number[] {
  const declared = cells.map((cell) =>
    getDeclaredWidth(getNodeStyle(cell.attrs?.style as string), box)
  );
  const spans = cells.map((cell) => Number(cell.attrs?.colspan) || 1);

  const claimed = declared.reduce<number>(
    (total, width) => total + (width ?? 0),
    0
  );
  const freeSpans = spans.reduce(
    (total, span, index) => (declared[index] === null ? total + span : total),
    0
  );
  const free = Math.max(0, box - claimed);

  return declared.map(
    (width, index) =>
      width ?? (freeSpans > 0 ? (free * spans[index]) / freeSpans : 0)
  );
}
