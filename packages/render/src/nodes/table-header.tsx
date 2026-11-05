import { is } from '@maily-to/shared';

import { insetXFromStyle } from '../lib/sizing';
import { getNodeStyle } from '../lib/styles';
import { getCellAttributes } from '../lib/table';
import type { NodeRenderer } from '../node';

export const tableHeader: NodeRenderer = (node, ctx) => {
  if (!is.tableHeader(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs.style);

  const size = insetXFromStyle(ctx.size, style);

  return (
    <th
      {...getCellAttributes(style)}
      colSpan={node.attrs.colspan}
      rowSpan={node.attrs.rowspan}
      style={style}
    >
      {ctx.child({ size }).children(node)}
    </th>
  );
};
