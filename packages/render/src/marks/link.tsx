import { is } from '@maily-to/shared';

import { getSafeHref } from '../lib/link';
import { resolveVariableText } from '../lib/resolve-variable';
import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

const DEFAULT_LINK_REL = 'noopener noreferrer nofollow';

export const link: MarkRenderer = (mark, text, ctx) => {
  if (!is.link(mark)) {
    return null;
  }

  const { href, rel, style, target, title } = mark.attrs;

  return (
    <a
      href={getSafeHref(href && resolveVariableText(href, ctx))}
      rel={rel ?? DEFAULT_LINK_REL}
      style={getNodeStyle(style)}
      target={target ?? '_blank'}
      title={title ?? undefined}
    >
      {text}
    </a>
  );
};
