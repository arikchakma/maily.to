import { is } from '@maily-to/shared';
import { Column as EmailColumn } from '@react-email/components';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const column: NodeRenderer = (node, ctx) => {
  if (!is.column(node)) {
    return null;
  }

  const width =
    ctx.get('columnWidth') ??
    (node.attrs.width === null ? undefined : `${node.attrs.width}%`);

  return (
    <EmailColumn
      className="tab-col-full"
      style={{
        margin: 0,
        verticalAlign: node.attrs.verticalAlign,
        width,
        ...getNodeStyle(node.attrs.style),
      }}
      width={width}
    >
      {ctx.children(node)}
    </EmailColumn>
  );
};
