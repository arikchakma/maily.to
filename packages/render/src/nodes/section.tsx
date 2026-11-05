import { is } from '@maily-to/shared';
import { Section } from '@react-email/components';

import { getNodeStyle, getStyleAlignment } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const section: NodeRenderer = (node, ctx) => {
  if (!is.section(node)) {
    return null;
  }

  const style = getNodeStyle(node.attrs?.style);
  const align = getStyleAlignment(style) ?? 'left';

  return (
    <Section align={align} style={style}>
      {ctx.children(node)}
    </Section>
  );
};
