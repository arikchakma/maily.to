import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 htmlCodeBlock node to the v2 schema.
 * Strips the `activeTab` attribute which was editor-only UI state
 * persisted into the document JSON.
 */
export function htmlCodeBlock(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Drop editor-only UI state with warning
  if ('activeTab' in attrs) {
    warnings.push({
      nodeType: 'htmlCodeBlock',
      field: 'activeTab',
      message:
        'Editor-only attribute "activeTab" is not supported in v2 and was dropped',
    });
    delete attrs.activeTab;
  }
}
