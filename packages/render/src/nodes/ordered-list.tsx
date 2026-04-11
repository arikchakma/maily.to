import { getCssDirection, is } from '@maily-to/shared';
import { Container } from '@react-email/components';

import { shouldSuppressMarginBottom } from '../lib/spacing';
import type { NodeRenderer } from '../node';

export const orderedList: NodeRenderer = (node, ctx) => {
  if (!is.orderedList(node)) {
    return null;
  }

  const { dir } = node.attrs;

  return (
    <Container
      style={{ marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20 }}
    >
      <ol
        style={{
          paddingLeft: 26,
          listStyleType: 'decimal',
          margin: 0,
          ...getCssDirection(dir),
        }}
      >
        {ctx.children(node)}
      </ol>
    </Container>
  );
};
