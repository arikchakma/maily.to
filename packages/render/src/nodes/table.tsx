import { is, MAILY_NODE_TYPES } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import { getTableAttributes } from '../lib/table';
import type { NodeRenderer } from '../node';

const RESPONSIVE_TABLE_CSS = `@media only screen and (max-width:480px){table[data-mly-responsive="stack"]>tbody>tr>td{display:block!important;width:100%!important}}`;

export const table: NodeRenderer = (node, ctx) => {
  if (!is.table(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs.style);
  const hasHeaders = node.content.some((row) =>
    row.content?.some((cell) => cell.type === MAILY_NODE_TYPES.TABLE_HEADER)
  );

  if (node.attrs.responsive) {
    ctx.style(RESPONSIVE_TABLE_CSS);
  }

  return (
    <table
      {...getTableAttributes(style)}
      border={node.attrs.border ?? 0}
      cellPadding={node.attrs.cellpadding ?? 0}
      cellSpacing={node.attrs.cellspacing ?? 0}
      data-mly-responsive={node.attrs.responsive ? 'stack' : undefined}
      role={hasHeaders ? undefined : 'presentation'}
      style={style}
    >
      <tbody>{ctx.children(node)}</tbody>
    </table>
  );
};
