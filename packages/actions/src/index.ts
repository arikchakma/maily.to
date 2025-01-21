'use server';

import { render } from '@maily-to/render';

export async function renderEmail(
  json: string,
  previewText?: string,
  paragraphSize?: string
) {
  if (!json) {
    throw new Error('JSON is required');
  }

  const content = JSON.parse(json);

  const html = await render(content, {
    preview: previewText,
    theme: { fontSize: { paragraph: paragraphSize } },
  });

  return html;
}

globalThis.renderEmail = renderEmail;
