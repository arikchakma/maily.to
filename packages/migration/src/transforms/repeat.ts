import type { MigrationWarning } from '../types';

export function repeat(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  if (node.type === 'for') {
    warnings.push({
      nodeType: 'for',
      field: 'type',
      message: 'Migrated deprecated "for" node → "repeat"',
    });
    node.type = 'repeat';
  }

  const attrs = node.attrs ?? {};

  if (
    typeof attrs.each === 'string' &&
    attrs.each &&
    !attrs.each.startsWith('{{')
  ) {
    warnings.push({
      nodeType: 'repeat',
      field: 'each',
      message: `Migrated "each: ${attrs.each}" → "each: {{${attrs.each}}}"`,
    });
    attrs.each = `{{${attrs.each}}}`;
  }

  if ('isUpdatingKey' in attrs) {
    warnings.push({
      nodeType: 'repeat',
      field: 'isUpdatingKey',
      message:
        'Editor-only attribute "isUpdatingKey" is not supported in v2 and was dropped',
    });
    delete attrs.isUpdatingKey;
  }
}
