import type { BoxSide, InlineStyle } from '@maily-to/shared';
import { BOX_SIDES, stringifyInlineStyles } from '@maily-to/shared';

type StyleDeclarations = Record<string, string | null | undefined>;

export function getStyleAttribute(
  declarations: StyleDeclarations
): string | null {
  const rest: InlineStyle = {};

  for (const [property, value] of Object.entries(declarations)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    rest[property] = value;
  }

  return stringifyInlineStyles(rest) || null;
}

export function getPixelValue(value: number): string {
  return `${value}px`;
}

const BOX_SIDE_SUFFIXES: Record<BoxSide, string> = {
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
  top: 'Top',
};

type BoxDeclarationsOptions = {
  bottom?: number | null;
  left?: number | null;
  property: 'margin' | 'padding';
  right?: number | null;
  top?: number | null;
};

export function getBoxDeclarations(
  options: BoxDeclarationsOptions
): InlineStyle {
  const { bottom, left, property, right, top } = options;
  const values: Record<BoxSide, number | null | undefined> = {
    bottom,
    left,
    right,
    top,
  };
  const declarations: InlineStyle = {};

  for (const side of BOX_SIDES) {
    const value = values[side];
    if (typeof value === 'number') {
      declarations[`${property}${BOX_SIDE_SUFFIXES[side]}`] =
        getPixelValue(value);
    }
  }

  return declarations;
}
