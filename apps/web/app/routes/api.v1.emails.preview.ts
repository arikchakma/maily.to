import { z } from 'zod';
import type { Route } from './+types/api.v1.emails.preview';
import { render } from '@maily-to/render';
import { serializeZodError } from '~/lib/errors';

export const DEFAULT_EDITOR_THEME_SCHEMA = z.object({
  container: z
    .object({
      backgroundColor: z.string().optional(),
      maxWidth: z.string().optional(),
      minWidth: z.string().optional(),

      paddingTop: z.string().optional(),
      paddingRight: z.string().optional(),
      paddingBottom: z.string().optional(),
      paddingLeft: z.string().optional(),

      borderRadius: z.string().optional(),
      borderWidth: z.string().optional(),
      borderColor: z.string().optional(),
    })
    .optional(),
  body: z
    .object({
      backgroundColor: z.string().optional(),
      paddingTop: z.string().optional(),
      paddingRight: z.string().optional(),
      paddingBottom: z.string().optional(),
      paddingLeft: z.string().optional(),
    })
    .optional(),
  button: z
    .object({
      backgroundColor: z.string().optional(),
      color: z.string().optional(),
      paddingTop: z.string().optional(),
      paddingRight: z.string().optional(),
      paddingBottom: z.string().optional(),
      paddingLeft: z.string().optional(),
    })
    .optional(),
  link: z
    .object({
      color: z.string().optional(),
    })
    .optional(),
});

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const body = await request.json();
  const schema = z.object({
    previewText: z.string().optional(),
    content: z.any(),
    theme: DEFAULT_EDITOR_THEME_SCHEMA.optional(),
  });

  const { data: bodyData, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { content, previewText } = bodyData;
  const html = await render(JSON.parse(content), {
    pretty: true,
    preview: previewText,
    theme: bodyData.theme,
  });

  return { html };
}
