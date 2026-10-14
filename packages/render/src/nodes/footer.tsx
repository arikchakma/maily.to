import { getCssDirection, is } from '@maily-to/shared';

import { ANTIALIASED, getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const footer: NodeRenderer = (node, ctx) => {
  if (!is.footer(node)) {
    return null;
  }

  return (
    <small
      dir={node.attrs?.dir ?? undefined}
      style={{
        ...ANTIALIASED,
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </small>
  );
};
