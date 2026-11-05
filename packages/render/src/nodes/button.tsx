import { BUTTON_KINDS, is } from '@maily-to/shared';
import { Button as EmailButton, Column, Row } from '@react-email/components';

import { getSafeHref } from '../lib/link';
import { resolveVariableText } from '../lib/resolve-variable';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const button: NodeRenderer = (node, ctx) => {
  if (!is.button(node)) {
    return null;
  }

  const { align, kind, url } = node.attrs;
  const style = getNodeStyle(node.attrs.style);
  const href = getSafeHref(resolveVariableText(url, ctx));

  if (kind === BUTTON_KINDS.FULL_WIDTH) {
    const { backgroundColor, color, ...cellStyle } = style ?? {};

    return (
      <Row>
        <Column align={align} style={{ backgroundColor, ...cellStyle }}>
          <a
            href={href}
            style={{
              color,
              display: 'block',
              textAlign: align,
              textDecoration: 'none',
            }}
            target="_blank"
          >
            {ctx.children(node)}
          </a>
        </Column>
      </Row>
    );
  }

  return (
    <Row>
      <Column align={align}>
        <EmailButton href={href} style={{ display: 'inline-block', ...style }}>
          {ctx.children(node)}
        </EmailButton>
      </Column>
    </Row>
  );
};
