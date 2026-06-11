import { getCssDirection, getFontStyle, is } from '@maily-to/shared';
import { Text } from '@react-email/components';

import { prepareAndRegisterFontFaceFromAttrs } from '../lib/font-face';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import { ANTIALIASED } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const paragraph: NodeRenderer = (node, ctx) => {
  if (!is.paragraph(node)) {
    return null;
  }

  const { textAlign, dir } = node.attrs;
  const theme = ctx.config.theme;
  const fontStyle = getFontStyle(node.attrs, theme.paragraph);
  prepareAndRegisterFontFaceFromAttrs(ctx, node.attrs, theme.paragraph);

  return (
    <Text
      style={{
        ...(textAlign ? { textAlign } : {}),
        ...getCssDirection(dir),
        color: theme.paragraph?.color,
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
