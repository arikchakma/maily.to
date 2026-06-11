import { is } from '@maily-to/shared';

import { resolveVariableId } from '../lib/resolve-variable';
import type { NodeRenderer } from '../node';

export const variable: NodeRenderer = (node, ctx) => {
  if (!is.variable(node)) {
    return null;
  }

  const { id, fallback } = node.attrs;
  if (!id) {
    return <>{fallback ?? ''}</>;
  }

  return <>{resolveVariableId(id, fallback, ctx)}</>;
};
