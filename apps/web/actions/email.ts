'use server';

import { renderAsync } from '@maily-to/render';

export async function previewEmailAction(_: string, formData: FormData) {
  try {
    // @TODO: Add validation
    const json = formData.get('json') as string;
    const previewText = formData.get('previewText') as string;

    if (!json) {
      return 'No JSON provided';
    }

    const content = JSON.parse(json);
    const html = await renderAsync(content, {
      preview: previewText,
    });

    return html;
  } catch (e: unknown) {
    return (e as Error).message || 'Something went wrong';
  }
}
