import type { MigrationWarning } from '../types';

const DEFAULT_SPACER_HEIGHT = 8;

const SPACER_ENUM_HEIGHTS: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 32,
  xl: 64,
};

export function spacer(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};
  const height = attrs.height;

  if (typeof height === 'number') {
    return;
  }

  if (typeof height === 'string' && height in SPACER_ENUM_HEIGHTS) {
    const value = SPACER_ENUM_HEIGHTS[height];
    warnings.push({
      nodeType: 'spacer',
      field: 'height',
      message: `Migrated "height" from string enum to number: ${height} → ${value}`,
    });

    attrs.height = value;
    return;
  }

  attrs.height = DEFAULT_SPACER_HEIGHT;
}
