import {
  MAILY_NODE_TYPES,
  parseInlineStyles,
  stringifyInlineStyles,
} from '@maily-to/shared';

import type { MigrationWarning } from '../types';

const ID_NODE_TYPES: string[] = [
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.REPEAT,
  MAILY_NODE_TYPES.COLUMNS,
  MAILY_NODE_TYPES.COLUMN,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.LIST_ITEM,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
  MAILY_NODE_TYPES.BLOCKQUOTE,
];

export function global(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  if (node.type === MAILY_NODE_TYPES.TEXT) {
    return;
  }

  if (!node.attrs) {
    node.attrs = {};
  }

  const attrs = node.attrs;

  if (attrs.showIfKey) {
    warnings.push({
      nodeType: node.type,
      field: 'showIfKey',
      message: 'Migrated "showIfKey" → "visibilityRule"',
    });
    attrs.visibilityRule = {
      action: 'show',
      variable: attrs.showIfKey,
      operator: 'is_true',
      value: '',
    };
  }
  delete attrs.showIfKey;

  if ('textDirection' in attrs) {
    if (attrs.textDirection) {
      warnings.push({
        nodeType: node.type,
        field: 'textDirection',
        message: 'Migrated "textDirection" → "dir"',
      });
      attrs.dir = attrs.textDirection;
    }
    delete attrs.textDirection;
  }

  if ('textAlign' in attrs) {
    if (attrs.textAlign && attrs.textAlign !== 'left') {
      warnings.push({
        nodeType: node.type,
        field: 'textAlign',
        message: 'Migrated "textAlign" → "style"',
      });

      const declarations = parseInlineStyles(attrs.style ?? '');
      declarations.textAlign = attrs.textAlign;
      attrs.style = stringifyInlineStyles(declarations);
    }
    delete attrs.textAlign;
  }

  if (ID_NODE_TYPES.includes(node.type) && !attrs.id) {
    attrs.id = crypto.randomUUID();
  }
}
