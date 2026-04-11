import { migrate } from '@maily-to/migration';
import { is } from '@maily-to/shared';
import { render as reactEmailRender } from '@react-email/render';
import type { JSONContent } from '@tiptap/core';

import { buildConfig } from './config';
import type { MailyConfig } from './config';
import { defineRenderContext } from './context';
import { document } from './nodes/document';

/**
 * Converts a Maily JSON document into React elements. Returns null
 * if the input is not a valid Maily node.
 */
export function markup(json: JSONContent, config: MailyConfig = {}) {
  const { json: migrated } = migrate(json);
  if (!is.node(migrated)) {
    return null;
  }

  return document(
    migrated,
    defineRenderContext({ config: buildConfig(config) })
  );
}

/** Renders a Maily JSON document to an HTML string using @react-email/render. */
export async function render(json: JSONContent, config: MailyConfig = {}) {
  if (!is.node(json)) {
    return '';
  }

  return reactEmailRender(markup(json, config));
}
