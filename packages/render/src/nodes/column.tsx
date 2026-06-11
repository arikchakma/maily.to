import { is } from '@maily-to/shared';
import { Column as EmailColumn } from '@react-email/components';

import type { NodeRenderer } from '../node';

export const column: NodeRenderer = (node, ctx) => {
  if (!is.column(node)) {
    return null;
  }

  const attrs = node.attrs;
  const width =
    ctx.get('columnTdWidth') ??
    (attrs.width === null ? undefined : `${attrs.width}%`);

  return (
    <EmailColumn
      width={width}
      className="tab-col-full"
      style={{
        margin: 0,
        width,
        verticalAlign: attrs.verticalAlign,
      }}
    >
      {ctx.children(node)}
    </EmailColumn>
  );
};
