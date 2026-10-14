import type { AnyMailyNode } from '@maily-to/shared';
import { is } from '@maily-to/shared';
import type { JSONContent } from '@tiptap/core';

/**
 * Extracts all valid URLs from link marks in a Maily document.
 * Returns a deduplicated Set of href strings.
 */
export function links(json: JSONContent): Set<string> {
  const links = new Set<string>();
  if (!is.node(json)) {
    return links;
  }

  function visitor(node: AnyMailyNode) {
    if (is.marked(node)) {
      for (const mark of node.marks) {
        if (!is.link(mark)) {
          continue;
        }

        const href = mark.attrs.href;
        if (!isValidUrl(href)) {
          continue;
        }

        links.add(href);
      }
    }

    if (is.parent(node)) {
      node.content.forEach(visitor);
    }
  }

  visitor(json);
  return links;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const UNSAFE_SCHEME = /^(?:data|javascript|vbscript):/i;

export function getSafeHref(url: string | null | undefined) {
  if (!url) {
    return url ?? undefined;
  }

  return UNSAFE_SCHEME.test(url.replace(/\s/g, '')) ? undefined : url;
}
