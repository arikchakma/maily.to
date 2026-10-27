import type { InlineStyle } from './style';

export const BORDER_STYLES = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted',
} as const;

export type AllowedBorderStyle =
  (typeof BORDER_STYLES)[keyof typeof BORDER_STYLES];

const allowedBorderStyles: readonly AllowedBorderStyle[] = Object.freeze(
  Object.values(BORDER_STYLES)
);

export const DEFAULT_BORDER_STYLE: AllowedBorderStyle = BORDER_STYLES.SOLID;

export function isAllowedBorderStyle(
  value: unknown
): value is AllowedBorderStyle {
  return (
    typeof value === 'string' &&
    allowedBorderStyles.includes(value as AllowedBorderStyle)
  );
}

export type BorderParts = {
  color: string | undefined;
  style: string | undefined;
  width: string | undefined;
};

/**
 * Reads the width, style and colour of a border from the `border` shorthand,
 * letting any longhand already in the style win. The shorthand lists its
 * parts in any order, so each is recognised by shape rather than position.
 */
export function getBorderParts(style: InlineStyle): BorderParts {
  const parts = (style.border ?? '').trim().split(/\s+/).filter(Boolean);

  let color: string | undefined;
  let borderStyle: string | undefined;
  let width: string | undefined;

  for (const part of parts) {
    if (isAllowedBorderStyle(part) || part === 'none') {
      borderStyle = part;
    } else if (/^[\d.]/.test(part)) {
      width = part;
    } else {
      color = part;
    }
  }

  return {
    color: style.borderColor ?? color,
    style: style.borderStyle ?? borderStyle,
    width: style.borderWidth ?? width,
  };
}
