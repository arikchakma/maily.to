import type { NodePosition } from '@maily-to/shared';
import { getSuppressedMargins, is } from '@maily-to/shared';

import type { RenderContext } from '../context';

function getNodePosition(ctx: RenderContext): NodePosition {
  const { parent, siblingIndex } = ctx;
  const content = parent && is.parent(parent) ? parent.content : [];

  return {
    isFirst: siblingIndex === 0,
    isLast: siblingIndex === content.length - 1,
    nextType: content[siblingIndex + 1]?.type,
    parentType: parent?.type,
    previousType: content[siblingIndex - 1]?.type,
  };
}

/**
 * Returns true if this node's bottom margin should be collapsed — i.e. it's
 * the last child of a block container, or is followed by a spacer or hr.
 */
export function shouldSuppressMarginBottom(ctx: RenderContext): boolean {
  return getSuppressedMargins(getNodePosition(ctx)).marginBottom;
}
