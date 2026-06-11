import { getCssDirection, getFontStyle, is } from '@maily-to/shared';

import { prepareAndRegisterFontFaceFromAttrs } from '../lib/font-face';
import {
  shouldSuppressMarginBottom,
  shouldSuppressMarginTop,
} from '../lib/spacing';
import type { NodeRenderer } from '../node';

export const blockquote: NodeRenderer = (node, ctx) => {
  if (!is.blockquote(node)) {
    return null;
  }

  const { dir } = node.attrs;
  const theme = ctx.config.theme;
  const fontStyle = getFontStyle(node.attrs, theme.blockquote);

  prepareAndRegisterFontFaceFromAttrs(ctx, node.attrs, theme.blockquote);

  return (
    <blockquote
      style={{
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: theme.blockquote?.borderColor,
        paddingLeft: '16px',
        marginLeft: '0px',
        marginRight: '0px',
        marginTop: shouldSuppressMarginTop(ctx) ? 0 : 20,
        marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20,
        color: theme.blockquote?.color,
        ...getCssDirection(dir),
        ...fontStyle,
      }}
    >
      {ctx.children(node)}
    </blockquote>
  );
};
