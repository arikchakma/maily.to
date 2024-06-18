import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './types';

export function renderSync(
  content: JSONContent,
  config?: MailyConfig & RenderOptions
): string {
  const { theme, preview, ...rest } = config || {};

  const maily = new Maily(content);
  maily.setPreviewText(preview);
  maily.setTheme(theme);

  return maily.renderSync(rest);
}
