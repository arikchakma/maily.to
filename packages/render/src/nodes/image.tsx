import {
  getBorderStyle,
  is,
  parseWidthToPercentage,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { Column, Img, Row } from '@react-email/components';

import { resolveVariableText } from '../lib/resolve-variable';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import type { NodeRenderer } from '../node';

export const image: NodeRenderer = (node, ctx) => {
  if (!is.image(node)) {
    return null;
  }

  const { src, alt, title, width, align, externalLink } = node.attrs;
  const resolvedSrc = resolveVariableText(src, ctx);
  const resolvedExternalLink = externalLink
    ? resolveVariableText(externalLink, ctx)
    : externalLink;
  const percent = parseWidthToPercentage(width, ctx.box);
  const absoluteWidth = Math.round((ctx.box * percent) / 100);

  const img = (
    <Img
      src={resolvedSrc}
      alt={alt}
      title={title}
      width={absoluteWidth}
      style={{
        width: width ?? '100%',
        maxWidth: absoluteWidth,
        height: 'auto',
        display: 'block',
        ...getBorderStyle(node.attrs),
      }}
    />
  );

  const content = resolvedExternalLink ? (
    <a
      href={resolvedExternalLink}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{ display: 'block' }}
    >
      {img}
    </a>
  ) : (
    img
  );

  return (
    <Row style={{ marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 32 }}>
      <Column align={align ?? TEXT_ALIGNMENTS.LEFT}>{content}</Column>
    </Row>
  );
};
