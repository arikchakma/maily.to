import { is } from '@maily-to/shared';

import { getSafeHref } from '../lib/link';
import { resolveVariableText } from '../lib/resolve-variable';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const inlineImage: NodeRenderer = (node, ctx) => {
  if (!is.inlineImage(node)) {
    return null;
  }

  const { alt, externalLink, height, src, width } = node.attrs;
  const resolvedSrc = resolveVariableText(src, ctx);
  const resolvedExternalLink = externalLink
    ? getSafeHref(resolveVariableText(externalLink, ctx))
    : externalLink;

  const img = (
    <img
      alt={alt ?? ''}
      height={height}
      src={resolvedSrc || undefined}
      style={{
        border: 'none',
        display: 'inline',
        height,
        outline: 'none',
        textDecoration: 'none',
        verticalAlign: 'middle',
        width,
        ...getNodeStyle(node.attrs.style),
      }}
      width={width}
    />
  );

  if (!resolvedExternalLink) {
    return img;
  }

  return (
    <a
      href={resolvedExternalLink}
      rel="noopener noreferrer nofollow"
      style={{ display: 'inline', textDecoration: 'none' }}
      target="_blank"
    >
      {img}
    </a>
  );
};
