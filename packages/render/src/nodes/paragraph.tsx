import { getCssDirection, is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const paragraph: NodeRenderer = (node, ctx) => {
  if (!is.paragraph(node)) {
    return null;
  }

  return (
    <p
      dir={node.attrs?.dir ?? undefined}
      style={{
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </p>
  );
};
