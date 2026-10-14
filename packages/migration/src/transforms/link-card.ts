import type { MigrationWarning } from '../types';

export function linkCard(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if ('mailyComponent' in attrs) {
    warnings.push({
      nodeType: 'linkCard',
      field: 'mailyComponent',
      message:
        'v1 marker attribute "mailyComponent" is not needed in v2 and was dropped',
    });
    delete attrs.mailyComponent;
  }
}
