import { is, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { MailyNodeType } from '@maily-to/shared';

import type { RenderContext } from '../context';

const BLOCK_CONTAINERS = new Set<MailyNodeType>([
  MAILY_NODE_TYPES.DOCUMENT,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.COLUMN,
  MAILY_NODE_TYPES.REPEAT,
]);

/**
 * Returns true if this node's top margin should be collapsed — i.e. it's
 * the first child of a block container or follows a spacer node.
 */
export function shouldSuppressMarginTop(ctx: RenderContext): boolean {
  const { parent, siblingIndex } = ctx;

  if (!parent || !is.node(parent) || !is.parent(parent)) {
    return true;
  }

  if (!BLOCK_CONTAINERS.has(parent.type)) {
    return true;
  }

  const prev = parent.content[siblingIndex - 1];

  const isFirst = siblingIndex === 0;
  const isPrevSpacer = prev?.type === MAILY_NODE_TYPES.SPACER;

  return isFirst || isPrevSpacer;
}

/**
 * Returns true if this node's bottom margin should be collapsed — i.e. it's
 * the last child of a block container, or is followed by a spacer or hr.
 */
export function shouldSuppressMarginBottom(ctx: RenderContext): boolean {
  const { parent, siblingIndex } = ctx;

  if (!parent || !is.node(parent) || !is.parent(parent)) {
    return true;
  }

  if (parent.type === MAILY_NODE_TYPES.LIST_ITEM) {
    return true;
  }

  if (!BLOCK_CONTAINERS.has(parent.type)) {
    return true;
  }

  const content = parent.content;
  const next = content[siblingIndex + 1];

  const isLast = siblingIndex === content.length - 1;
  const isNextSpacer = next?.type === MAILY_NODE_TYPES.SPACER;
  const isNextHr = next?.type === MAILY_NODE_TYPES.HORIZONTAL_RULE;

  return isLast || isNextSpacer || isNextHr;
}
