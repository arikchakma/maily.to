import { migrate, requireContentMigration } from '@maily-to/migration';
import { render } from '@maily-to/render';
import { z } from 'zod';

import { serializeZodError } from '~/lib/errors';

import type { Route } from './+types/api.v1.emails.preview';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const body = await request.json();
  const schema = z.object({
    previewText: z.string().optional(),
    content: z.string().min(1, 'Please provide a content'),
  });

  const { data: bodyData, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { content, previewText } = bodyData;
  const parsed = JSON.parse(content);
  const document = requireContentMigration(parsed)
    ? migrate(parsed).json
    : parsed;
  const html = await render(document, { preview: previewText });

  return { html };
}
