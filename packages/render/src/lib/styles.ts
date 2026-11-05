import type { InlineStyle } from '@maily-to/shared';
import { parseInlineStyles } from '@maily-to/shared';
import type { CSSProperties } from 'react';

export function getNodeStyle(
  style: string | null | undefined
): InlineStyle | undefined {
  return style ? parseInlineStyles(style) : undefined;
}

export const ANTIALIASED: Pick<
  CSSProperties,
  'WebkitFontSmoothing' | 'MozOsxFontSmoothing'
> = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

export function getStyleAlignment(style: InlineStyle | undefined) {
  const start = style?.marginLeft === 'auto';
  const end = style?.marginRight === 'auto';

  if (start && end) {
    return 'center';
  }
  if (end) {
    return 'left';
  }
  if (start) {
    return 'right';
  }

  return undefined;
}
