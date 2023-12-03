import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig } from './maily';

export async function renderAsync(
  content: JSONContent,
  config?: MailyConfig
): Promise<string> {
  const maily = new Maily(content, config);
  return maily.renderAsync();
}
