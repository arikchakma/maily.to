import { is } from '@maily-to/shared';

import { insetXFromStyle } from '../lib/sizing';
import { getNodeStyle } from '../lib/styles';
import { getCellAttributes } from '../lib/table';
import type { NodeRenderer } from '../node';

export const tableCell: NodeRenderer = (node, ctx) => {
  if (!is.tableCell(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs.style);

  const size = insetXFromStyle(ctx.size, style);

  return (
    <td
      {...getCellAttributes(style)}
      colSpan={node.attrs.colspan}
      rowSpan={node.attrs.rowspan}
      style={style}
    >
      {ctx.child({ size }).children(node)}
    </td>
  );
};
