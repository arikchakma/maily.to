import { is } from '@maily-to/shared';
import { Hr } from '@react-email/components';

import {
  shouldSuppressMarginBottom,
  shouldSuppressMarginTop,
} from '../lib/spacing';
import type { NodeRenderer } from '../node';

export const horizontalRule: NodeRenderer = (node, ctx) => {
  if (!is.horizontalRule(node)) {
    return null;
  }

  const theme = ctx.config.theme;

  return (
    <Hr
      style={{
        borderColor: theme.horizontalRule?.color,
        marginTop: shouldSuppressMarginTop(ctx) ? 0 : 32,
        marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 32,
      }}
    />
  );
};
