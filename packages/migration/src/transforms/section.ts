import type { InlineStyle } from '@maily-to/shared';
import { parseInlineStyles } from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getBoxStyleDeclarations } from '../utils/box-style';
import { getBoxDeclarations, getStyleAttribute } from '../utils/style';

const MARGIN_FIELDS = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
] as const;

/**
 * Migrates a v1 section node to the v2 schema.
 * v1 stored its look as separate attributes and rendered them verbatim, so
 * every one of them becomes an explicit declaration in `style`:
 *   - backgroundColor, borderWidth/borderColor and borderRadius.
 *   - paddingTop/Right/Bottom/Left and marginTop/Right/Bottom/Left, zeros
 *     included, because the v2 section theme otherwise adds 8px of padding.
 *   - align → text-align, unless it is the v1 default "left".
 */
export function section(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};
  const declarations: InlineStyle = {
    ...parseInlineStyles(attrs.style ?? ''),
    ...getBoxStyleDeclarations({ attrs, nodeType: 'section', warnings }),
  };

  const margin = getBoxDeclarations({
    bottom: attrs.marginBottom,
    left: attrs.marginLeft,
    property: 'margin',
    right: attrs.marginRight,
    top: attrs.marginTop,
  });
  if (Object.keys(margin).length > 0) {
    warnings.push({
      nodeType: 'section',
      field: 'margin',
      message: 'Migrated "margin*" → "style"',
    });
    Object.assign(declarations, margin);
  }
  for (const field of MARGIN_FIELDS) {
    delete attrs[field];
  }

  if (attrs.align && attrs.align !== 'left') {
    warnings.push({
      nodeType: 'section',
      field: 'align',
      message: 'Migrated "align" → "style"',
    });
    declarations.textAlign = attrs.align;
  }
  delete attrs.align;

  const style = getStyleAttribute(declarations);
  if (style) {
    attrs.style = style;
  }
}
