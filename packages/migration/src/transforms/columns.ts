import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 columns node to the v2 schema.
 * In v2, columns tracks its child count and gap explicitly:
 *   - Sets `columnCount` to the number of column children in `content`.
 *   - Sets `gap` to the default value of 8 if not already present.
 */
export function columns(
  node: Record<string, any>,
  _warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Add columnCount = count of content children
  attrs.columnCount ??= node.content?.length ?? 0;

  // Add gap default
  attrs.gap ??= 8;
}
