import { getCssDirection, is } from '@maily-to/shared';
import { Container } from '@react-email/components';

import { shouldSuppressMarginBottom } from '../lib/spacing';
import type { NodeRenderer } from '../node';

export const bulletList: NodeRenderer = (node, ctx) => {
  if (!is.bulletList(node)) {
    return null;
  }

  const { dir } = node.attrs;

  return (
    <Container
      style={{ marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20 }}
    >
      <ul
        style={{
          paddingLeft: 26,
          listStyleType: 'disc',
          margin: 0,
          ...getCssDirection(dir),
        }}
      >
        {ctx.children(node)}
      </ul>
    </Container>
  );
};
