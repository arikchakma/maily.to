import { getCssDirection, getFontStyle, is } from '@maily-to/shared';
import { Text } from '@react-email/components';

import { prepareAndRegisterFontFaceFromAttrs } from '../lib/font-face';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import { ANTIALIASED } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const footer: NodeRenderer = (node, ctx) => {
  if (!is.footer(node)) {
    return null;
  }

  const { textAlign, dir } = node.attrs;
  const theme = ctx.config.theme;
  const fontStyle = getFontStyle(node.attrs, theme.footer);
  prepareAndRegisterFontFaceFromAttrs(ctx, node.attrs, theme.footer);

  return (
    <Text
      style={{
        ...(textAlign ? { textAlign } : {}),
        ...getCssDirection(dir),
        color: theme.footer?.color,
        marginTop: 0,
        marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20,
        ...ANTIALIASED,
        ...fontStyle,
      }}
    >
      {ctx.children(node)}
    </Text>
  );
};
