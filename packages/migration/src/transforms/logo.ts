import { DEFAULT_CONTAINER_WIDTH_PIXELS } from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getWidthPercentage } from '../utils/image-width';
import { getVariableReference } from '../utils/variable';

const LOGO_SIZE_PIXELS: Record<string, number> = {
  sm: 40,
  md: 48,
  lg: 64,
};

const DEFAULT_LOGO_SIZE_PIXELS = 48;

/**
 * Migrates a v1 logo node by converting it into a v2 image node.
 * The logo node type was removed in v2 — logos are now just images.
 * Performs the following conversions:
 *   - Changes `type: 'logo'` → `type: 'image'`.
 *   - Maps the `size` enum (sm/md/lg → 40/48/64 pixels) to a percentage
 *     `width`, scaled against the container width stamped by
 *     `annotateContainerWidths`.
 *   - Renames `alignment` → `align`.
 *   - Resolves `isSrcVariable` into a variable reference inside `src`.
 *   - Drops the `maily-component` marker.
 */
export function logo(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  node.type = 'image';

  const attrs = node.attrs ?? {};

  if ('size' in attrs) {
    const pixels = LOGO_SIZE_PIXELS[attrs.size] ?? DEFAULT_LOGO_SIZE_PIXELS;
    const containerWidth =
      attrs._containerWidth ?? DEFAULT_CONTAINER_WIDTH_PIXELS;
    const percentage = getWidthPercentage({ containerWidth, pixels });

    warnings.push({
      nodeType: 'logo',
      field: 'size',
      message: `Migrated "size: ${attrs.size}" → "width: ${percentage}%"`,
    });
    attrs.width = `${percentage}%`;
    delete attrs.size;
  }

  delete attrs._containerWidth;

  if ('alignment' in attrs) {
    warnings.push({
      nodeType: 'logo',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
    attrs.align = attrs.alignment;
    delete attrs.alignment;
  }

  if (attrs.isSrcVariable === true) {
    warnings.push({
      nodeType: 'logo',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
    attrs.src = getVariableReference(attrs.src);
  }
  delete attrs.isSrcVariable;

  if ('maily-component' in attrs) {
    warnings.push({
      nodeType: 'logo',
      field: 'maily-component',
      message:
        'Attribute "maily-component" is not supported in v2 and was dropped',
    });
    delete attrs['maily-component'];
  }
}
