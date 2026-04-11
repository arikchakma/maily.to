import type { AnyMailyNode, MailyNodeType } from '@maily-to/shared';
import { is, MAILY_NODE_TYPES } from '@maily-to/shared';
import { Fragment } from 'react';

import type { RenderContext } from './context';
import { blockquote } from './nodes/blockquote';
import { bulletList } from './nodes/bullet-list';
import { button } from './nodes/button';
import { column } from './nodes/column';
import { columns } from './nodes/columns';
import { document } from './nodes/document';
import { footer } from './nodes/footer';
import { hardBreak } from './nodes/hard-break';
import { heading } from './nodes/heading';
import { horizontalRule } from './nodes/horizontal-rule';
import { htmlCodeBlock } from './nodes/html-code-block';
import { image } from './nodes/image';
import { inlineImage } from './nodes/inline-image';
import { linkCard } from './nodes/link-card';
import { listItem } from './nodes/list-item';
import { orderedList } from './nodes/ordered-list';
import { paragraph } from './nodes/paragraph';
import { repeat } from './nodes/repeat';
import { section } from './nodes/section';
import { spacer } from './nodes/spacer';
import { text } from './nodes/text';
import { variable } from './nodes/variable';

/**
 * Function signature for a node renderer. Each node type (paragraph,
 * button, image, etc.) implements this to produce its React output.
 */
export type NodeRenderer = (
  node: AnyMailyNode,
  ctx: RenderContext
) => React.ReactNode;

const MAILY_NODE_RENDERERS: Partial<Record<MailyNodeType, NodeRenderer>> = {
  [MAILY_NODE_TYPES.DOCUMENT]: document,
  [MAILY_NODE_TYPES.PARAGRAPH]: paragraph,
  [MAILY_NODE_TYPES.TEXT]: text,
  [MAILY_NODE_TYPES.HEADING]: heading,
  [MAILY_NODE_TYPES.VARIABLE]: variable,
  [MAILY_NODE_TYPES.IMAGE]: image,
  [MAILY_NODE_TYPES.INLINE_IMAGE]: inlineImage,
  [MAILY_NODE_TYPES.SPACER]: spacer,
  [MAILY_NODE_TYPES.SECTION]: section,
  [MAILY_NODE_TYPES.BUTTON]: button,
  [MAILY_NODE_TYPES.REPEAT]: repeat,
  [MAILY_NODE_TYPES.COLUMNS]: columns,
  [MAILY_NODE_TYPES.COLUMN]: column,
  [MAILY_NODE_TYPES.BULLET_LIST]: bulletList,
  [MAILY_NODE_TYPES.ORDERED_LIST]: orderedList,
  [MAILY_NODE_TYPES.LIST_ITEM]: listItem,
  [MAILY_NODE_TYPES.HORIZONTAL_RULE]: horizontalRule,
  [MAILY_NODE_TYPES.HTML_CODE_BLOCK]: htmlCodeBlock,
  [MAILY_NODE_TYPES.BLOCKQUOTE]: blockquote,
  [MAILY_NODE_TYPES.HARD_BREAK]: hardBreak,
  [MAILY_NODE_TYPES.FOOTER]: footer,
  [MAILY_NODE_TYPES.LINK_CARD]: linkCard,
};

export function dispatch(
  node: AnyMailyNode,
  ctx: RenderContext
): React.ReactNode {
  if (!is.node(node)) {
    return null;
  }

  const renderer = MAILY_NODE_RENDERERS[node.type];
  if (!renderer) {
    return null;
  }

  return renderer(node, ctx);
}

export function children(
  parent: AnyMailyNode,
  ctx: RenderContext
): React.ReactNode[] {
  if (!is.parent(parent)) {
    return [];
  }

  return parent.content
    .map((child: AnyMailyNode, index: number) => {
      const childCtx = ctx.child({ parent, siblingIndex: index });
      const component = childCtx.render(child);
      if (!component) {
        return null;
      }

      return <Fragment key={index}>{component}</Fragment>;
    })
    .filter(Boolean);
}
