import {
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
} from '@maily-to/shared';

import type { MigrationWarning } from '../types';

const LOGO_SIZE_MAP: Record<string, number> = {
  sm: 40,
  md: 48,
  lg: 64,
};

const DEFAULT_CONTAINER_WIDTH = 600;

/**
 * Migrates a v1 logo node by converting it into a v2 image node.
 * The logo node type was removed in v2 — logos are now just images.
 * Performs the following conversions:
 *   - Changes `type: 'logo'` → `type: 'image'`.
 *   - Maps the `size` enum (sm/md/lg) to a numeric `width` string
 *     (40/48/64 pixels respectively).
 *   - Renames `alignment` → `align`.
 *   - Sets v2 image border defaults (all radii and widths to 0).
 *   - Drops deprecated `isSrcVariable` flag.
 */
export function logo(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  // Change type: 'logo' → 'image'
  node.type = 'image';

  const attrs = node.attrs ?? {};

  // Map size → width (percentage)
  if ('size' in attrs) {
    const px = LOGO_SIZE_MAP[attrs.size] ?? 48;
    const container = attrs._containerWidth ?? DEFAULT_CONTAINER_WIDTH;
    const percent = Math.min(
      MAX_IMAGE_WIDTH_PERCENTAGE,
      Math.max(MIN_IMAGE_WIDTH_PERCENTAGE, Math.round((px / container) * 100))
    );
    warnings.push({
      nodeType: 'logo',
      field: 'size',
      message: `Migrated "size: ${attrs.size}" → "width: ${percent}%"`,
    });
    attrs.width = `${percent}%`;
    delete attrs.size;
  }

  // Clean up temporary annotation
  delete attrs._containerWidth;

  // alignment → align
  if ('alignment' in attrs) {
    warnings.push({
      nodeType: 'logo',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
    attrs.align = attrs.alignment;
    delete attrs.alignment;
  }

  // Set image defaults
  attrs.borderRadiusMode ??= 'uniform';
  attrs.borderWidthMode ??= 'uniform';
  attrs.borderStyle ??= 'solid';
  attrs.borderColor ??= '#000000';
  attrs.borderTopWidth ??= 0;
  attrs.borderRightWidth ??= 0;
  attrs.borderBottomWidth ??= 0;
  attrs.borderLeftWidth ??= 0;
  attrs.borderTopLeftRadius ??= 0;
  attrs.borderTopRightRadius ??= 0;
  attrs.borderBottomRightRadius ??= 0;
  attrs.borderBottomLeftRadius ??= 0;

  // Drop with warnings
  const DROPPED_LOGO_ATTRS = ['isSrcVariable', 'maily-component'] as const;
  for (const field of DROPPED_LOGO_ATTRS) {
    if (field in attrs) {
      warnings.push({
        nodeType: 'logo',
        field,
        message: `Attribute "${field}" is not supported in v2 and was dropped`,
      });
      delete attrs[field];
    }
  }
}
