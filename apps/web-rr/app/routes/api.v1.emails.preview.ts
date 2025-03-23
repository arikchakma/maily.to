import { z } from 'zod';
import type { Route } from './+types/api.v1.emails.preview';
import { render } from '@maily-to/render';
import { data } from 'react-router';
import { serializeZodError } from '~/lib/errors';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const body = await request.json();
  const schema = z.object({
    previewText: z.string().optional(),
    content: z.any(),
  });

  const { data: bodyData, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { content, previewText } = bodyData;
  const html = await render(JSON.parse(content), {
    pretty: true,
    preview: previewText,
  });

  return { html };
}
