import type { MigrationWarning } from '../types';

const DEFAULT_SPACER_HEIGHT = 8;
const SPACING = [
  {
    name: 'Extra Small',
    short: 'xs',
    value: 4,
  },
  {
    name: 'Small',
    short: 'sm',
    value: 8,
  },
  {
    name: 'Medium',
    short: 'md',
    value: 16,
  },
  {
    name: 'Large',
    short: 'lg',
    value: 32,
  },
  {
    name: 'Extra Large',
    short: 'xl',
    value: 64,
  },
];

const ALLOWED_SPACING_SHORT_NAMES = SPACING.map((s) => s.short);

/**
 * Migrates a v1 spacer node to the v2 schema.
 * Sets `heightMode` to "uniform" if not already present.
 * In v2, spacers support per-side height control via heightMode;
 * v1 spacers only had a single uniform height value.
 */
export function spacer(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  let height = node.attrs?.height;
  if (
    typeof height === 'string' &&
    ALLOWED_SPACING_SHORT_NAMES.includes(height)
  ) {
    const spacing = SPACING.find((s) => s.short === height);
    warnings.push({
      nodeType: 'spacer',
      field: 'height',
      message: `Migrated "height" from string enum to number: ${height} → ${spacing?.value}`,
    });

    height = spacing?.value ?? DEFAULT_SPACER_HEIGHT;
  }

  attrs.height = height;
  attrs.heightMode ??= 'uniform';
}
