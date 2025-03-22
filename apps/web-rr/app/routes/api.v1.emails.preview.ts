import { z } from 'zod';
import type { Route } from './+types/api.v1.emails.preview';
import { render } from '@maily-to/render';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  const body = await request.json();
  const schema = z.object({
    previewText: z.string().optional(),
    content: z.any(),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return { status: 400, message: error.message, errors: error.errors };
  }

  const { content, previewText } = data;
  const html = await render(JSON.parse(content), {
    pretty: true,
    preview: previewText,
  });

  return { html };
}
