import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './maily';

export function renderSync(
  content: JSONContent,
  config?: MailyConfig & RenderOptions
): string {
  const { theme, preview, ...rest } = config || {};
  const maily = new Maily(content, {
    theme,
    preview,
  });
  return maily.renderSync(rest);
}
