import { is } from '@maily-to/shared';

import { resolveVariableText } from '../lib/resolve-variable';
import type { NodeRenderer } from '../node';

export const inlineImage: NodeRenderer = (node, ctx) => {
  if (!is.inlineImage(node)) {
    return null;
  }

  const { src, alt, width, height, externalLink } = node.attrs;
  const resolvedSrc = resolveVariableText(src, ctx);
  const resolvedExternalLink = externalLink
    ? resolveVariableText(externalLink, ctx)
    : externalLink;

  const img = (
    <img
      src={resolvedSrc}
      alt={alt ?? ''}
      width={width}
      height={height}
      style={{
        display: 'inline',
        verticalAlign: 'middle',
        width,
        height,
        outline: 'none',
        border: 'none',
        textDecoration: 'none',
      }}
    />
  );

  if (resolvedExternalLink) {
    return (
      <a
        href={resolvedExternalLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{
          display: 'inline',
          textDecoration: 'none',
        }}
      >
        {img}
      </a>
    );
  }

  return img;
};
