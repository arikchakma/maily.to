import type { MigrationWarning } from '../types';
import { uid } from '../utils/id';

/**
 * Applies transforms common to every node in the document tree.
 * Handles three conversions that apply regardless of node type:
 *   1. showIfKey → visibilityRule: converts the v1 conditional
 *      visibility string into a structured v2 VisibilityRule object
 *      with action "show", operator "is_true".
 *   2. textDirection → dir: renames the attribute to match the v2
 *      schema (mirrors the HTML `dir` attribute).
 *   3. id generation: assigns a crypto UUID to any node that lacks
 *      an id, except for `doc` and `text` nodes which don't use ids.
 */
export function global(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  // Text nodes don't have attrs
  if (node.type === 'text') {
    return;
  }

  if (!node.attrs) {
    node.attrs = {};
  }

  const attrs = node.attrs;

  // showIfKey → visibilityRule
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

  // textDirection → dir
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

  // Generate id if missing (skip doc node)
  if (node.type !== 'doc' && !attrs.id) {
    attrs.id = uid();
  }
}
