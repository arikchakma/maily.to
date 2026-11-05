import { getCssDirection, is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const orderedList: NodeRenderer = (node, ctx) => {
  if (!is.orderedList(node)) {
    return null;
  }

  return (
    <ol
      start={node.attrs?.start}
      style={{
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </ol>
  );
};
