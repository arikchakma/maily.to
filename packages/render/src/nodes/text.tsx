import { is, isDef } from '@maily-to/shared';

import { marks } from '../mark';
import type { NodeRenderer } from '../node';

export const text: NodeRenderer = (node, ctx) => {
  if (!is.text(node)) {
    return null;
  }

  if (is.marked(node)) {
    return marks(node, ctx);
  }

  const { text } = node;
  if (!isDef(text)) {
    return <>&nbsp;</>;
  }

  return <>{text}</>;
};
