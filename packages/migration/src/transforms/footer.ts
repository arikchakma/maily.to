import type { MigrationWarning } from '../types';

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
