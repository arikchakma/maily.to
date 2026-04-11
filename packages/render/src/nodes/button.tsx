import {
  BUTTON_KINDS,
  getBorderStyle,
  getCssDirection,
  getFontStyle,
  is,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { Button as EmailButton, Container } from '@react-email/components';
import type { CSSProperties } from 'react';

import { prepareAndRegisterFontFaceFromAttrs } from '../lib/font-face';
import { resolveVariableText } from '../lib/resolve-variable';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import { shouldShow } from '../lib/visibility';
import type { NodeRenderer } from '../node';

export const button: NodeRenderer = (node, ctx) => {
  if (!is.button(node)) {
    return null;
  }

  if (!shouldShow(node, ctx)) {
    return null;
  }

  const attrs = node.attrs;
  const { dir } = attrs;
  const theme = ctx.config.theme;

  const backgroundColor =
    attrs.backgroundColor ?? theme.button?.backgroundColor;
  const color = attrs.color ?? theme.button?.color;
  const url = resolveVariableText(attrs.url ?? '', ctx);
  const kind = attrs.kind ?? BUTTON_KINDS.TIGHT;
  const alignment = attrs.alignment ?? TEXT_ALIGNMENTS.CENTER;
  const isFullWidth = kind === BUTTON_KINDS.FULL_WIDTH;

  const paddingTop = attrs.paddingTop ?? theme.button?.paddingTop ?? 10;
  const paddingRight = attrs.paddingRight ?? theme.button?.paddingRight ?? 32;
  const paddingBottom =
    attrs.paddingBottom ?? theme.button?.paddingBottom ?? 10;
  const paddingLeft = attrs.paddingLeft ?? theme.button?.paddingLeft ?? 32;

  const borderStyle = getBorderStyle(attrs);

  const fontStyle = getFontStyle(attrs, theme.button);
  prepareAndRegisterFontFaceFromAttrs(ctx, attrs, theme.button);

  const containerStyle: CSSProperties = {
    textAlign: alignment,
    marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20,
  };

  if (isFullWidth) {
    return (
      <Container style={containerStyle}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          role="presentation"
        >
          <tbody>
            <tr>
              <td
                align={alignment}
                style={{
                  backgroundColor,
                  paddingTop,
                  paddingRight,
                  paddingBottom,
                  paddingLeft,
                  ...borderStyle,
                  ...getCssDirection(dir),
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  style={{
                    color,
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: alignment,
                    ...fontStyle,
                  }}
                >
                  {ctx.children(node)}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </Container>
    );
  }

  return (
    <Container style={containerStyle}>
      <EmailButton
        href={url}
        style={{
          backgroundColor,
          color,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          display: 'inline-block',
          ...borderStyle,
          ...getCssDirection(dir),
          ...fontStyle,
        }}
      >
        {ctx.children(node)}
      </EmailButton>
    </Container>
  );
};
