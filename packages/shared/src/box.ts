import type { InlineStyle } from './style';

export const BOX_SIDES = ['top', 'right', 'bottom', 'left'] as const;
export type BoxSide = (typeof BOX_SIDES)[number];
export type BoxSideValues = Record<BoxSide, number>;

export const BOX_CORNERS = [
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
] as const;
export type BoxCorner = (typeof BOX_CORNERS)[number];
export type BoxCornerValues = Record<BoxCorner, number>;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * CSS box shorthands repeat their values when fewer than four are given:
 * one applies to every edge, two to the vertical then horizontal pair, and
 * three to top, the horizontal pair, then bottom.
 */
function getShorthandEdges(shorthand: string | undefined) {
  const parts = (shorthand ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return null;
  }

  const [first, second = first, third = first, fourth = second] = parts;

  return [first, second, third, fourth].map(toLength);
}

function toLength(value: string) {
  const parsed = Number.parseFloat(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function getLonghand(
  style: InlineStyle,
  property: string,
  edge: string,
  suffix: string
) {
  return style[`${property}${capitalize(edge)}${suffix}`];
}

function toShorthand(edges: number[]) {
  const [first, second, third, fourth] = edges;
  const values =
    first === third && second === fourth
      ? first === second
        ? [first]
        : [first, second]
      : [first, second, third, fourth];

  return values.map((value) => `${value}px`).join(' ');
}

export function getBoxSides(
  style: InlineStyle,
  property: string
): BoxSideValues {
  const edges = getShorthandEdges(style[property]) ?? [0, 0, 0, 0];
  const [top, right, bottom, left] = edges;
  const sides: BoxSideValues = { bottom, left, right, top };

  for (const side of BOX_SIDES) {
    const longhand = getLonghand(style, property, side, '');
    if (longhand !== undefined) {
      sides[side] = toLength(longhand);
    }
  }

  return sides;
}

export function toBoxSides(
  property: string,
  values: BoxSideValues
): Record<string, string | null> {
  const declarations: Record<string, string | null> = {
    [property]: toShorthand([
      values.top,
      values.right,
      values.bottom,
      values.left,
    ]),
  };

  for (const side of BOX_SIDES) {
    declarations[`${property}${capitalize(side)}`] = null;
  }

  return declarations;
}

/**
 * Radius shorthands run clockwise from the top-left corner, and repeat the
 * same way box shorthands do.
 */
export function getBoxCorners(
  style: InlineStyle,
  property: string
): BoxCornerValues {
  const edges = getShorthandEdges(style[property]) ?? [0, 0, 0, 0];
  const [topLeft, topRight, bottomRight, bottomLeft] = edges;
  const corners: BoxCornerValues = {
    bottomLeft,
    bottomRight,
    topLeft,
    topRight,
  };

  for (const corner of BOX_CORNERS) {
    const longhand = getLonghand(style, 'border', corner, 'Radius');
    if (longhand !== undefined) {
      corners[corner] = toLength(longhand);
    }
  }

  return corners;
}

export function toBoxCorners(
  property: string,
  values: BoxCornerValues
): Record<string, string | null> {
  const declarations: Record<string, string | null> = {
    [property]: toShorthand([
      values.topLeft,
      values.topRight,
      values.bottomRight,
      values.bottomLeft,
    ]),
  };

  for (const corner of BOX_CORNERS) {
    declarations[`border${capitalize(corner)}Radius`] = null;
  }

  return declarations;
}
