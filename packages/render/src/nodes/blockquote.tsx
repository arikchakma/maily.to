import { getCssDirection, is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const blockquote: NodeRenderer = (node, ctx) => {
  if (!is.blockquote(node)) {
    return null;
  }

  return (
    <blockquote
      dir={node.attrs?.dir ?? undefined}
      style={{
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </blockquote>
  );
};
