import {
  DEFAULT_FONT,
  getFontFaceStyle,
  is,
  TEXT_DIRECTIONS,
} from '@maily-to/shared';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
} from '@react-email/components';

import { registerFontFace } from '../lib/font-face';
import { meta as renderMeta } from '../lib/meta';
import { preview as renderPreview } from '../lib/preview';
import { initSize, insetBox, parsePxValue } from '../lib/sizing';
import type { NodeRenderer } from '../node';

const BASE_CSS = /* css */ `blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}`;

export const document: NodeRenderer = (node, ctx) => {
  if (!is.doc(node)) {
    return null;
  }

  const { dir } = node.attrs;
  const { theme, preview, meta, htmlProps, openTrackingPixel } = ctx.config;

  const font = theme.font;
  const container = theme.container ?? {};
  const body = theme.body ?? {};

  const containerWidth = parsePxValue(container.maxWidth);
  const size = insetBox(initSize(containerWidth), {
    paddingLeft:
      parsePxValue(container.paddingLeft) + parsePxValue(body.paddingLeft),
    paddingRight:
      parsePxValue(container.paddingRight) + parsePxValue(body.paddingRight),
    borderLeft: container.borderWidth,
    borderRight: container.borderWidth,
  });

  const primaryFont = font === undefined ? DEFAULT_FONT : font;
  if (primaryFont) {
    registerFontFace(ctx, primaryFont);
  }

  const child = ctx.child({ size }).children(node);
  for (const fontEntry of ctx.fonts.values()) {
    ctx.style(getFontFaceStyle(fontEntry));
  }

  const css = BASE_CSS + Array.from(ctx.styles).join('');

  const bodyStyle = {
    ...body,
    ...(primaryFont && primaryFont.fontFamily
      ? {
          fontFamily: `'${primaryFont.fontFamily}', ${primaryFont.fallbackFontFamily}`,
        }
      : {}),
  };

  const resolvedPreview = preview
    ? renderPreview(preview, ctx.child({ size }))
    : null;

  return (
    <Html
      lang="en"
      {...htmlProps}
      {...(dir && dir !== TEXT_DIRECTIONS.AUTO ? { dir } : {})}
    >
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no,date=no,url=no"
        />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {renderMeta(meta)}
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <Body style={bodyStyle}>
        {resolvedPreview && <Preview>{resolvedPreview}</Preview>}
        <Container style={container}>
          {child}

          {openTrackingPixel && (
            <Img
              src={openTrackingPixel}
              width="1"
              height="1"
              alt=""
              style={{ display: 'none' }}
            />
          )}
        </Container>
      </Body>
    </Html>
  );
};
