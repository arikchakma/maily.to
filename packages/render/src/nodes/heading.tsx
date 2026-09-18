import { getCssDirection, is } from '@maily-to/shared';
import { Heading } from '@react-email/components';

import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

const HEADING_LEVELS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const;

export const heading: NodeRenderer = (node, ctx) => {
  if (!is.heading(node)) {
    return null;
  }

  return (
    <Heading
      as={HEADING_LEVELS[node.attrs.level]}
      dir={node.attrs.dir ?? undefined}
      style={{
        ...getCssDirection(node.attrs.dir),
        ...getNodeStyle(node.attrs.style),
      }}
    >
      {ctx.children(node)}
    </Heading>
  );
};
