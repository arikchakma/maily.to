import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 link mark to the v2 schema.
 * Removes the `isUrlVariable` flag from the mark attrs.
 * In v1, this boolean indicated whether the href was a variable
 * reference; v2 handles variable detection differently and no
 * longer needs this flag.
 */
export function link(
  mark: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = mark.attrs ?? {};

  if ('isUrlVariable' in attrs) {
    warnings.push({
      nodeType: 'link',
      field: 'isUrlVariable',
      message:
        'Attribute "isUrlVariable" is not supported in v2 and was dropped',
    });
    delete attrs.isUrlVariable;
  }
}
