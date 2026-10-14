import { is } from '@maily-to/shared';
import { Hr } from '@react-email/components';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const horizontalRule: NodeRenderer = (node) => {
  if (!is.horizontalRule(node)) {
    return null;
  }

  return <Hr style={getNodeStyle(node.attrs?.style)} />;
};
