import { DEFAULT_CONTAINER_MAX_WIDTH, is } from '@maily-to/shared';
import { Container } from '@react-email/components';

import { initSize, insetXFromStyle, parsePxValue } from '../lib/sizing';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const container: NodeRenderer = (node, ctx) => {
  if (!is.container(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs?.style);

  const size = insetXFromStyle(
    initSize(parsePxValue(style?.maxWidth) || DEFAULT_CONTAINER_MAX_WIDTH),
    style
  );

  return (
    <Container style={style}>{ctx.child({ size }).children(node)}</Container>
  );
};
