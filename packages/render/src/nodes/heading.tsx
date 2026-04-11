import {
  getCssDirection,
  getFontStyle,
  is,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { Heading } from '@react-email/components';

import { prepareAndRegisterFontFaceFromAttrs } from '../lib/font-face';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import type { NodeRenderer } from '../node';

const HEADING_LEVELS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const;

export const heading: NodeRenderer = (node, ctx) => {
  if (!is.heading(node)) {
    return null;
  }

  const { level, textAlign, dir } = node.attrs;
  const theme = ctx.config.theme;

  const element = HEADING_LEVELS[level];
  const key = `h${level}` as 'h1' | 'h2' | 'h3';
  const defaults = theme.heading?.[key];
  const fontStyle = getFontStyle(node.attrs, defaults);

  prepareAndRegisterFontFaceFromAttrs(ctx, node.attrs, defaults);

  return (
    <Heading
      as={element}
      style={{
        textAlign: textAlign ?? TEXT_ALIGNMENTS.LEFT,
        ...getCssDirection(dir),
        color: theme.heading?.defaults?.color,
        marginTop: 0,
        marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 12,
        ...fontStyle,
      }}
    >
      {ctx.children(node)}
    </Heading>
  );
};
