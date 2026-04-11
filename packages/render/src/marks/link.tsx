import { is } from '@maily-to/shared';

import { resolveVariableText } from '../lib/resolve-variable';
import type { MarkRenderer } from '../mark';

export const link: MarkRenderer = (mark, text, ctx) => {
  if (!is.link(mark)) {
    return null;
  }

  const theme = ctx.config.theme;
  const linkOverride = ctx.config.variableValues.get(mark.attrs.href);
  const href =
    (typeof linkOverride === 'string' ? linkOverride : undefined) ??
    resolveVariableText(mark.attrs.href, ctx);
  const color = theme.link?.color;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={color ? { color } : undefined}
    >
      {text}
    </a>
  );
};
