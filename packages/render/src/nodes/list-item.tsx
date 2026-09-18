import { getCssDirection, is } from '@maily-to/shared';

import { ANTIALIASED, getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const listItem: NodeRenderer = (node, ctx) => {
  if (!is.listItem(node)) {
    return null;
  }

  return (
    <li
      dir={node.attrs?.dir ?? undefined}
      style={{
        ...ANTIALIASED,
        ...getCssDirection(node.attrs?.dir),
        ...getNodeStyle(node.attrs?.style),
      }}
    >
      {ctx.children(node)}
    </li>
  );
};
