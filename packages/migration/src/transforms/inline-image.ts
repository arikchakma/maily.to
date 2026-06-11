import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 inlineImage node to the v2 schema.
 * Performs the following conversions:
 *   - Converts `src: null` or `src: undefined` to an empty string,
 *     since v2 expects src to always be a string.
 *   - Drops deprecated flags: isSrcVariable, isExternalLinkVariable.
 */
export function inlineImage(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Convert src: null → ''
  if (attrs.src == null) {
    attrs.src = '';
  }

  // Drop with warnings
  const DROPPED_INLINE_IMAGE_ATTRS = [
    'isSrcVariable',
    'isExternalLinkVariable',
  ] as const;
  for (const field of DROPPED_INLINE_IMAGE_ATTRS) {
    if (field in attrs) {
      warnings.push({
        nodeType: 'inlineImage',
        field,
        message: `Attribute "${field}" is not supported in v2 and was dropped`,
      });
      delete attrs[field];
    }
  }
}
