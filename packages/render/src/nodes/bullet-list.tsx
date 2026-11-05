import { getCssDirection, is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const bulletList: NodeRenderer = (node, ctx) => {
  if (!is.bulletList(node)) {
    return null;
  }

  return (
    <ul
      dir={node.attrs?.dir ?? undefined}
      style={{
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </ul>
  );
};
