import { is } from '@maily-to/shared';
import { Body } from '@react-email/components';

import { getPreviewSlot, getTrackingPixelSlot } from '../lib/slots';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const body: NodeRenderer = (node, ctx) => {
  if (!is.body(node)) {
    return null;
  }

  const { parent } = ctx;
  const isShell = is.node(parent) && is.doc(parent);

  return (
    <Body style={getNodeStyle(node.attrs?.style)}>
      {isShell ? getPreviewSlot(ctx) : null}
      {ctx.children(node)}
      {isShell ? getTrackingPixelSlot(ctx) : null}
    </Body>
  );
};
