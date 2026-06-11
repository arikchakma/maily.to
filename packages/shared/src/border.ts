import type { Properties } from 'csstype';

import type { AllowedFieldMode } from './field-mode';
import { FIELD_MODE } from './field-mode';

export const BORDER_STYLES = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted',
} as const;

export type AllowedBorderStyle =
  (typeof BORDER_STYLES)[keyof typeof BORDER_STYLES];

export const DEFAULT_BORDER_STYLE: AllowedBorderStyle = BORDER_STYLES.SOLID;

export const DEFAULT_BORDER_COLOR = '#000000';

/**
 * Full border configuration for a node. Includes border style, color,
 * per-side widths (top/right/bottom/left), per-corner radii, and
 * field modes that control whether each group is edited uniformly
 * or independently.
 */
export type BorderStyleConfig = {
  borderStyle: AllowedBorderStyle;

  borderColor: string;

  borderWidthMode: AllowedFieldMode;
  borderTopWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;

  borderRadiusMode: AllowedFieldMode;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
};

/**
 * Converts a BorderStyleConfig into CSS properties for inline styles.
 * When all widths or radii are equal (or the mode is "uniform"), emits
 * shorthand CSS; otherwise emits per-side longhand properties.
 */
export function getBorderStyle(config: BorderStyleConfig): Properties {
  const {
    borderStyle = DEFAULT_BORDER_STYLE,
    borderColor = DEFAULT_BORDER_COLOR,
    borderWidthMode,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderRadiusMode,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
  } = config;

  const isBorderWidthUniform =
    borderWidthMode === FIELD_MODE.UNIFORM ||
    (borderLeftWidth === borderRightWidth &&
      borderRightWidth === borderBottomWidth &&
      borderBottomWidth === borderTopWidth);
  const isBorderRadiusUniform =
    borderRadiusMode === FIELD_MODE.UNIFORM ||
    (borderTopLeftRadius === borderTopRightRadius &&
      borderTopRightRadius === borderBottomRightRadius &&
      borderBottomRightRadius === borderBottomLeftRadius);

  return {
    ...(isBorderWidthUniform
      ? { border: `${borderTopWidth}px ${borderStyle} ${borderColor}` }
      : {
          borderTopWidth: `${borderTopWidth}px`,
          borderRightWidth: `${borderRightWidth}px`,
          borderBottomWidth: `${borderBottomWidth}px`,
          borderLeftWidth: `${borderLeftWidth}px`,
          borderStyle,
          borderColor,
        }),
    ...(isBorderRadiusUniform
      ? { borderRadius: `${borderTopLeftRadius}px` }
      : {
          borderRadius: `${borderTopLeftRadius}px ${borderTopRightRadius}px ${borderBottomRightRadius}px ${borderBottomLeftRadius}px`,
        }),
  };
}
