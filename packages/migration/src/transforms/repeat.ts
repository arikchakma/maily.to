import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 repeat node to the v2 schema.
 * Wraps the `each` attribute value in Handlebars-style template syntax
 * if it isn't already wrapped. For example, `'items'` becomes `'{{items}}'`.
 * In v2, the each value must be a template expression; v1 allowed
 * bare variable names without delimiters.
 */
export function repeat(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Wrap `each` value in template syntax if not already wrapped
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

  // Drop editor-only transient state with warning
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
