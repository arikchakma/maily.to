import { getCssDirection, is } from '@maily-to/shared';

import { ANTIALIASED } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const listItem: NodeRenderer = (node, ctx) => {
  if (!is.listItem(node)) {
    return null;
  }

  const { dir } = node.attrs;

  return (
    <li
      style={{
        color: ctx.config.theme.listMarker?.color,
        marginBottom: 8,
        marginTop: 8,
        paddingLeft: 6,
        ...ANTIALIASED,
        ...getCssDirection(dir),
      }}
    >
      {ctx.children(node)}
    </li>
  );
};
