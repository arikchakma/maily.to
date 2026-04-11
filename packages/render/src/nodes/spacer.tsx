import { is } from '@maily-to/shared';
import { Container } from '@react-email/components';

import type { NodeRenderer } from '../node';

export const spacer: NodeRenderer = (node) => {
  if (!is.spacer(node)) {
    return null;
  }

  const { height } = node.attrs;

  return <Container style={{ height: `${height}px` }} />;
};
