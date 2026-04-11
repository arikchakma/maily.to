import type { MigrationWarning } from '../types';

const DROPPED_COLUMN_ATTRS = [
  'columnId',
  'backgroundColor',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  // visibilityRule is the converted form of showIfKey (handled by global transform)
  'visibilityRule',
] as const;

/**
 * Migrates a v1 column node to the v2 schema.
 * Performs the following conversions:
 *   - Converts `width: 'auto'` → `null` (v2 uses null for equal-space columns).
 *   - Converts percentage width strings (e.g. "50%") to numbers (e.g. 50).
 *   - Drops v1 styling attributes that are not supported on columns in v2:
 *     columnId, backgroundColor, borderRadius, borderWidth, borderColor,
 *     paddingTop/Right/Bottom/Left, and visibilityRule (converted from showIfKey
 *     by the global transform). Each dropped attribute emits a warning.
 */
export function column(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Convert width: 'auto' → null, percentage string → number
  if (attrs.width === 'auto') {
    attrs.width = null;
  } else if (typeof attrs.width === 'string') {
    const parsed = parseFloat(attrs.width);
    attrs.width = Number.isNaN(parsed) ? null : parsed;
  }

  // Drop unsupported attrs with warnings
  for (const field of DROPPED_COLUMN_ATTRS) {
    if (field in attrs && attrs[field] != null) {
      warnings.push({
        nodeType: 'column',
        field,
        message: `Column attribute "${field}" is not supported in v2 and was dropped`,
      });
      delete attrs[field];
    }
  }
}
