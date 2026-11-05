import type { MigrationWarning } from '../types';
import { getVariableReference } from '../utils/variable';

export function inlineImage(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if (attrs.src == null) {
    attrs.src = '';
  }

  if (attrs.isSrcVariable === true) {
    warnings.push({
      nodeType: 'inlineImage',
      field: 'isSrcVariable',
      message: 'Migrated "isSrcVariable" → variable reference in "src"',
    });
    attrs.src = getVariableReference(attrs.src);
  }
  delete attrs.isSrcVariable;

  if (attrs.isExternalLinkVariable === true && attrs.externalLink) {
    warnings.push({
      nodeType: 'inlineImage',
      field: 'isExternalLinkVariable',
      message:
        'Migrated "isExternalLinkVariable" → variable reference in "externalLink"',
    });
    attrs.externalLink = getVariableReference(attrs.externalLink);
  }
  delete attrs.isExternalLinkVariable;
}
