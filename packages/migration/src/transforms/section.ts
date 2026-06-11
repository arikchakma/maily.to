import type { MigrationWarning } from '../types';
import { splitBorderRadius, splitBorderWidth } from '../utils/border';

/**
 * Migrates a v1 section node to the v2 schema.
 * Performs the following conversions:
 *   - Splits the single `borderRadius` number into four corner properties.
 *   - Splits the single `borderWidth` number into four side properties.
 *   - Sets v2 mode defaults: borderRadiusMode/borderWidthMode "uniform",
 *     paddingMode "uniform", marginMode "mixed", borderStyle "solid".
 */
export function section(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Split borderRadius (number) → 4 corners
  if (typeof attrs.borderRadius === 'number') {
    warnings.push({
      nodeType: 'section',
      field: 'borderRadius',
      message: 'Migrated "borderRadius" → individual corner radius properties',
    });
    Object.assign(attrs, splitBorderRadius(attrs.borderRadius));
    delete attrs.borderRadius;
  }

  // Split borderWidth (number) → 4 sides
  if (typeof attrs.borderWidth === 'number') {
    warnings.push({
      nodeType: 'section',
      field: 'borderWidth',
      message: 'Migrated "borderWidth" → individual side width properties',
    });
    Object.assign(attrs, splitBorderWidth(attrs.borderWidth));
    delete attrs.borderWidth;
  }

  // Set mode defaults
  attrs.borderRadiusMode ??= 'uniform';
  attrs.borderWidthMode ??= 'uniform';
  attrs.paddingMode ??= 'uniform';
  attrs.marginMode ??= 'mixed';
  attrs.borderStyle ??= 'solid';
  attrs.borderColor ??= '#000000';
}
