import { is } from '@maily-to/shared';

import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

const DEFAULT_LINK_REL = 'noopener noreferrer nofollow';

export const link: MarkRenderer = (mark, text) => {
  if (!is.link(mark)) {
    return null;
  }

  const { href, rel, style, target, title } = mark.attrs;

  return (
    <a
      href={href}
      rel={rel ?? DEFAULT_LINK_REL}
      style={getNodeStyle(style)}
      target={target ?? '_blank'}
      title={title ?? undefined}
    >
      {text}
    </a>
  );
};
