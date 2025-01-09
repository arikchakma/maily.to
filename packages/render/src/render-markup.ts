import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './maily';

export async function renderMarkup(
  content: JSONContent,
  config?: MailyConfig
): Promise<string> {
  const { theme, preview } = config || {};

  const maily = new Maily(content);
  maily.setPreviewText(preview);
  maily.setTheme(theme || {});

  return maily.renderMarkup();
}
