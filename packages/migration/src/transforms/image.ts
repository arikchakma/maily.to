import {
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
} from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { splitBorderRadius } from '../utils/border';

const DEFAULT_CONTAINER_WIDTH = 600;

/**
 * Migrates a v1 image node to the v2 schema.
 * Performs the following conversions:
 *   - Renames `alignment` → `align` to match the v2 attribute name.
 *   - Splits the single `borderRadius` number into four corner properties.
 *   - Converts `width: 'auto'` → `'100%'` (v2 uses percentage strings).
 *   - Sets v2 border defaults: borderRadiusMode/borderWidthMode "uniform",
 *     borderStyle "solid", all border widths to 0.
 *   - Drops deprecated attrs: height, isSrcVariable, isExternalLinkVariable,
 *     lockAspectRatio, aspectRatio.
 */
export function image(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // alignment → align
  if ('alignment' in attrs) {
    warnings.push({
      nodeType: 'image',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
    attrs.align = attrs.alignment;
    delete attrs.alignment;
  }

  // Split borderRadius (number) → 4 corners
  if (typeof attrs.borderRadius === 'number') {
    warnings.push({
      nodeType: 'image',
      field: 'borderRadius',
      message: 'Migrated "borderRadius" → individual corner radius properties',
    });
    Object.assign(attrs, splitBorderRadius(attrs.borderRadius));
    delete attrs.borderRadius;
  }

  // Convert width to percentage string
  const container = attrs._containerWidth ?? DEFAULT_CONTAINER_WIDTH;
  delete attrs._containerWidth;

  if (attrs.width === 'auto') {
    attrs.width = '100%';
  } else if (
    typeof attrs.width === 'number' ||
    (typeof attrs.width === 'string' && !attrs.width.endsWith('%'))
  ) {
    const px = Number(attrs.width);
    if (!Number.isNaN(px) && px > 0) {
      const percent = Math.min(
        MAX_IMAGE_WIDTH_PERCENTAGE,
        Math.max(MIN_IMAGE_WIDTH_PERCENTAGE, Math.round((px / container) * 100))
      );
      attrs.width = `${percent}%`;
    }
  }

  // Set defaults
  attrs.borderRadiusMode ??= 'uniform';
  attrs.borderWidthMode ??= 'uniform';
  attrs.borderStyle ??= 'solid';
  attrs.borderColor ??= '#000000';
  attrs.borderTopWidth ??= 0;
  attrs.borderRightWidth ??= 0;
  attrs.borderBottomWidth ??= 0;
  attrs.borderLeftWidth ??= 0;

  // Drop with warnings
  const DROPPED_IMAGE_ATTRS = [
    'height',
    'isSrcVariable',
    'isExternalLinkVariable',
    'lockAspectRatio',
    'aspectRatio',
  ] as const;
  for (const field of DROPPED_IMAGE_ATTRS) {
    if (field in attrs) {
      warnings.push({
        nodeType: 'image',
        field,
        message: `Attribute "${field}" is not supported in v2 and was dropped`,
      });
      delete attrs[field];
    }
  }
}
