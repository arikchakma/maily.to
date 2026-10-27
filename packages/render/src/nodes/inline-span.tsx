import { is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const inlineSpan: NodeRenderer = (node) => {
  if (!is.inlineSpan(node)) {
    return null;
  }

  return <span style={getNodeStyle(node.attrs?.style)} />;
};
