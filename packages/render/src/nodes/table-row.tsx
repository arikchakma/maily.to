import { is } from '@maily-to/shared';
import { Fragment } from 'react';

import { initSize } from '../lib/sizing';
import { getNodeStyle } from '../lib/styles';
import { getCellWidths, getRowAttributes } from '../lib/table';
import type { NodeRenderer } from '../node';

export const tableRow: NodeRenderer = (node, ctx) => {
  if (!is.tableRow(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs?.style);

  const widths = getCellWidths(node.content, ctx.box);

  return (
    <tr {...getRowAttributes(style)} style={style}>
      {node.content.map((cell, index) => (
        <Fragment key={index}>
          {ctx
            .child({
              parent: node,
              siblingIndex: index,
              size: initSize(widths[index]),
            })
            .render(cell)}
        </Fragment>
      ))}
    </tr>
  );
};
