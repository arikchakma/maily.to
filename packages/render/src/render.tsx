import type { AnyMailyNode } from '@maily-to/shared';
import { invariant, is } from '@maily-to/shared';
import { render as renderReactEmail } from '@react-email/render';

import { buildConfig } from './config';
import type { MailyConfig } from './config';
import { defineRenderContext } from './context';
import { getNormalizedDocument } from './lib/normalize';
import { getThemedDocument } from './lib/theme';

export function markup(json: AnyMailyNode, config: MailyConfig = {}) {
  invariant(
    is.doc(json),
    `Expected a Maily document, received "${json?.type}"`
  );

  return defineRenderContext({ config: buildConfig(config) }).render(
    getThemedDocument({
      document: getNormalizedDocument({ document: json }),
      theme: config.theme,
    })
  );
}

export async function render(json: AnyMailyNode, config: MailyConfig = {}) {
  return renderReactEmail(markup(json, config));
}

export async function renderText(json: AnyMailyNode, config: MailyConfig = {}) {
  return renderReactEmail(markup(json, config), { plainText: true });
}
