import type { InlineStyle } from '@maily-to/shared';
import { parseInlineStyles } from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getBoxStyleDeclarations } from '../utils/box-style';
import { getStyleAttribute } from '../utils/style';

const DROPPED_COLUMN_ATTRS = ['columnId', 'visibilityRule'] as const;

/**
 * Migrates a v1 column node to the v2 schema.
 * Performs the following conversions:
 *   - Converts `width: 'auto'` → `null` (v2 uses null for equal-space columns).
 *   - Converts percentage width strings (e.g. "50%") to numbers (e.g. 50).
 *   - Converts the v1 styling attributes backgroundColor, borderRadius,
 *     borderWidth/borderColor and paddingTop/Right/Bottom/Left into `style`.
 *   - Drops columnId and visibilityRule, neither of which a v2 column
 *     supports. Each dropped attribute emits a warning.
 */
export function column(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  if (attrs.width === 'auto') {
    attrs.width = null;
  } else if (typeof attrs.width === 'string') {
    const parsed = parseFloat(attrs.width);
    attrs.width = Number.isNaN(parsed) ? null : parsed;
  }

  const declarations: InlineStyle = {
    ...parseInlineStyles(attrs.style ?? ''),
    ...getBoxStyleDeclarations({ attrs, nodeType: 'column', warnings }),
  };

  const style = getStyleAttribute(declarations);
  if (style) {
    attrs.style = style;
  }

  for (const field of DROPPED_COLUMN_ATTRS) {
    if (field in attrs && attrs[field] != null) {
      warnings.push({
        nodeType: 'column',
        field,
        message: `Column attribute "${field}" is not supported in v2 and was dropped`,
      });
      delete attrs[field];
    }
  }
}
