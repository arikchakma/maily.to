import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './maily';

export async function render(
  content: JSONContent,
  config?: MailyConfig & RenderOptions
): Promise<string> {
  const { theme, preview, ...rest } = config || {};

  const maily = new Maily(content);
  maily.setPreviewText(preview);
  maily.setTheme(theme || {});

  maily.setPayloadValue('items', [
    {
      name: 'John Doe',
    },
    {
      name: 'Novu',
    },
  ]);

  maily.setPayloadValue('shouldShow', true);

  return maily.render(rest);
}
