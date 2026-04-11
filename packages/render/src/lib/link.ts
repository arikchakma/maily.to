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
        if (!isValid(href)) {
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

function isValid(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
