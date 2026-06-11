import { is } from '@maily-to/shared';
import type { AnyMailyNode } from '@maily-to/shared';
import type { JSONContent } from '@tiptap/core';

import type { RenderContext } from '../context';
import { resolveVariableId, resolveVariableText } from './resolve-variable';

/**
 * Resolves a preview value to a plain string.
 *
 * - `string` → resolves `{{variable}}` placeholders
 * - `JSONContent` → walks the tree and resolves variable nodes
 */
export function preview(
  preview: string | JSONContent,
  ctx: RenderContext
): string {
  if (typeof preview === 'string') {
    return resolveVariableText(preview, ctx);
  }

  return walk(preview, ctx);
}

function walk(doc: JSONContent, ctx: RenderContext): string {
  const parts: string[] = [];
  if (!is.node(doc)) {
    return parts.join('');
  }

  function visitor(node: AnyMailyNode) {
    if (is.text(node)) {
      parts.push(node.text ?? '');
    }

    if (is.variable(node)) {
      const { id, fallback } = node.attrs;
      if (!id) {
        return;
      }

      parts.push(resolveVariableId(id, fallback ?? undefined, ctx));
    }

    if (is.parent(node)) {
      node.content.forEach(visitor);
    }
  }

  visitor(doc);
  return parts.join('');
}
