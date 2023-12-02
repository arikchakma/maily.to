import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig } from './maily';

export function render(content: JSONContent, config?: MailyConfig): string {
  const maily = new Maily(content, config);
  return maily.render();
}
