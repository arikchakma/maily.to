import type { MigrationWarning } from '../types';

const DEFAULT_COLUMNS_GAP = 8;

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

  attrs.columnCount ??= node.content?.length ?? 0;
  attrs.gap ??= DEFAULT_COLUMNS_GAP;
}
