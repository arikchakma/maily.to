import { getFontFaceStyle, is } from '@maily-to/shared';
import { Head, Html } from '@react-email/components';

import { registerDocumentFonts } from '../lib/font-face';
import { meta as renderMeta } from '../lib/meta';
import type { NodeRenderer } from '../node';

export const document: NodeRenderer = (node, ctx) => {
  if (!is.doc(node)) {
    return null;
  }

  const { dir } = node.attrs ?? {};
  const { htmlProps, meta } = ctx.config;

  registerDocumentFonts({ ctx, node });

  const content = ctx.children(node);
  for (const font of ctx.fonts.values()) {
    ctx.style(getFontFaceStyle(font));
  }

  const css = Array.from(ctx.styles).join('');

  return (
    <Html lang="en" {...htmlProps} {...(dir ? { dir } : {})}>
      <Head>
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
        {renderMeta(meta)}
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      {content}
    </Html>
  );
};
