import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './maily';

export async function renderAsync(
  content: JSONContent,
  config?: MailyConfig & RenderOptions
): Promise<string> {
  const { theme, preview, ...rest } = config || {};
  const maily = new Maily(content, {
    theme,
    preview,
  });
  return maily.renderAsync(rest);
}
