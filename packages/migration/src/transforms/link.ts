import type { MigrationWarning } from '../types';
import { getVariableReference } from '../utils/variable';

export function link(
  mark: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = mark.attrs ?? {};

  if (attrs.isUrlVariable === true) {
    warnings.push({
      nodeType: 'link',
      field: 'isUrlVariable',
      message: 'Migrated "isUrlVariable" → variable reference in "href"',
    });
    attrs.href = getVariableReference(attrs.href ?? '');
  }
  delete attrs.isUrlVariable;
}
