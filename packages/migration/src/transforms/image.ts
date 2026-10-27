import type { InlineStyle } from '@maily-to/shared';
import {
  DEFAULT_CONTAINER_WIDTH_PIXELS,
  parseInlineStyles,
} from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getWidthPercentage } from '../utils/image-width';
import { getPixelValue, getStyleAttribute } from '../utils/style';
import { getVariableReference } from '../utils/variable';

const DROPPED_IMAGE_ATTRS = [
  'height',
  'lockAspectRatio',
  'aspectRatio',
] as const;

/**
 * Migrates a v1 image node to the v2 schema.
 * Performs the following conversions:
 *   - Renames `alignment` → `align` to match the v2 attribute name.
 *   - Moves the `borderRadius` number into the `style` attribute.
 *   - Converts `width` to a percentage string, using the container width
 *     stamped by `annotateContainerWidths` to scale pixel values.
 *   - Resolves `isSrcVariable` / `isExternalLinkVariable` into variable
 *     references inside `src` / `externalLink`.
 *   - Drops deprecated attrs: height, lockAspectRatio, aspectRatio.
 */
export function image(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if ('alignment' in attrs) {
    warnings.push({
      nodeType: 'image',
      field: 'alignment',
      message: 'Migrated "alignment" → "align"',
    });
    attrs.align = attrs.alignment;
    delete attrs.alignment;
  }

  const declarations: InlineStyle = {};

  if (typeof attrs.borderRadius === 'number' && attrs.borderRadius > 0) {
    warnings.push({
      nodeType: 'image',
      field: 'borderRadius',
      message: 'Migrated "borderRadius" → "style"',
    });
    declarations.borderRadius = getPixelValue(attrs.borderRadius);
  }
  delete attrs.borderRadius;

  const containerWidth =
    attrs._containerWidth ?? DEFAULT_CONTAINER_WIDTH_PIXELS;
  delete attrs._containerWidth;

  if (attrs.width === 'auto') {
    attrs.width = '100%';
  } else if (
    typeof attrs.width === 'number' ||
    (typeof attrs.width === 'string' && !attrs.width.endsWith('%'))
  ) {
    const pixels = Number(attrs.width);
    if (!Number.isNaN(pixels) && pixels > 0) {
      attrs.width = `${getWidthPercentage({ containerWidth, pixels })}%`;
    }
  }

  if (attrs.isSrcVariable === true) {
    warnings.push({
      nodeType: 'image',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
    attrs.src = getVariableReference(attrs.src);
  }
  delete attrs.isSrcVariable;

  if (attrs.isExternalLinkVariable === true && attrs.externalLink) {
    warnings.push({
      nodeType: 'image',
      field: 'isExternalLinkVariable',
      message:
        'Migrated "isExternalLinkVariable" → variable reference in "externalLink"',
    });
    attrs.externalLink = getVariableReference(attrs.externalLink);
  }
  delete attrs.isExternalLinkVariable;

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

  const style = getStyleAttribute({
    ...parseInlineStyles(attrs.style ?? ''),
    ...declarations,
  });

  if (style) {
    attrs.style = style;
  }
}
