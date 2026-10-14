import { is } from '@maily-to/shared';
import { Container } from '@react-email/components';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const spacer: NodeRenderer = (node) => {
  if (!is.spacer(node)) {
    return null;
  }

  return (
    <Container
      style={{
        height: `${node.attrs.height}px`,
        ...getNodeStyle(node.attrs.style),
      }}
    />
  );
};
