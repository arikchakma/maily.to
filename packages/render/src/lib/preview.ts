import type { AnyMailyNode } from '@maily-to/shared';
import { is } from '@maily-to/shared';
import type { JSONContent } from '@tiptap/core';

import type { RenderContext } from '../context';
import { resolveVariableId, resolveVariableText } from './resolve-variable';

type PreviewOptions = {
  ctx: RenderContext;
  preview: JSONContent | string;
};

/**
 * Resolves a preview value to a plain string.
 *
 * - `string` → resolves `{{variable}}` placeholders
 * - `JSONContent` → walks the tree and resolves variable nodes
 */
export function preview(options: PreviewOptions): string {
  const { ctx, preview } = options;

  if (typeof preview === 'string') {
    return resolveVariableText(preview, ctx);
  }

  return getWalkedText({ ctx, doc: preview });
}

type WalkedTextOptions = {
  ctx: RenderContext;
  doc: JSONContent;
};

function getWalkedText(options: WalkedTextOptions): string {
  const { ctx, doc } = options;

  const parts: string[] = [];
  if (!is.node(doc)) {
    return parts.join('');
  }

  function visitor(node: AnyMailyNode) {
    if (is.text(node)) {
      parts.push(node.text);
    }

    if (is.variable(node)) {
      const { fallback, id } = node.attrs;
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
