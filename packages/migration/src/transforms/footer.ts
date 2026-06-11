import type { MigrationWarning } from '../types';

/**
 * Migrates a v1 footer node to the v2 schema.
 * Removes the `maily-component` attribute which was used in v1
 * as a marker to identify the footer node. In v2, the node type
 * alone is sufficient for identification.
 */
export function footer(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if ('maily-component' in attrs) {
    warnings.push({
      nodeType: 'footer',
      field: 'maily-component',
      message:
        'v1 marker attribute "maily-component" is not needed in v2 and was dropped',
    });
    delete attrs['maily-component'];
  }
}
