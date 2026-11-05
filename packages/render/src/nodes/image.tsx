import { is, parseWidthToPercentage } from '@maily-to/shared';
import { Column, Img, Row } from '@react-email/components';

import { getSafeHref } from '../lib/link';
import { resolveVariableText } from '../lib/resolve-variable';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const image: NodeRenderer = (node, ctx) => {
  if (!is.image(node)) {
    return null;
  }

  const { align, alt, externalLink, src, title, width } = node.attrs;
  const resolvedSrc = resolveVariableText(src, ctx);
  const resolvedExternalLink = externalLink
    ? getSafeHref(resolveVariableText(externalLink, ctx))
    : externalLink;
  const percent = parseWidthToPercentage(width, ctx.box);
  const absoluteWidth = Math.round((ctx.box * percent) / 100);

  const img = (
    <Img
      alt={alt ?? undefined}
      src={resolvedSrc || undefined}
      style={{
        display: 'block',
        height: 'auto',
        maxWidth: absoluteWidth,
        width: width ?? '100%',
        ...getNodeStyle(node.attrs.style),
      }}
      title={title ?? undefined}
      width={absoluteWidth}
    />
  );

  return (
    <Row data-skip-in-text="true">
      <Column align={align}>
        {resolvedExternalLink ? (
          <a
            href={resolvedExternalLink}
            rel="noopener noreferrer nofollow"
            style={{ display: 'block' }}
            target="_blank"
          >
            {img}
          </a>
        ) : (
          img
        )}
      </Column>
    </Row>
  );
};
