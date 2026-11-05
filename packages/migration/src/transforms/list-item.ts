import { parseInlineStyles, stringifyInlineStyles } from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getStyleAttribute } from '../utils/style';

export function listItem(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if (attrs.color != null) {
    const style = getStyleAttribute({ color: attrs.color });

    if (style) {
      warnings.push({
        nodeType: 'listItem',
        field: 'color',
        message: 'Migrated "color" → "style"',
      });

      attrs.style = stringifyInlineStyles({
        ...parseInlineStyles(attrs.style ?? ''),
        ...parseInlineStyles(style),
      });
    }
  }
  delete attrs.color;
}
