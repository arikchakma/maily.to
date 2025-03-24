import { z } from 'zod';
import type { Route } from './+types/api.v1.emails.preview';
import { serializeZodError } from '~/lib/errors';
import { apiConfigCookie } from '~/lib/api-config.server';
import { json } from '~/lib/response';
import { render } from '@maily-to/render';
import { Resend } from 'resend';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const body = await request.json();
  const schema = z.object({
    previewText: z.string().optional(),
    subject: z.string().min(1, 'Please provide a subject'),
    from: z.string().min(1, 'Please provide a valid email'),
    replyTo: z.string(),
    to: z.string().min(1, 'Please provide a valid email'),
    content: z.string().min(1, 'Please provide a content'),
  });

  const { data: bodyData, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const cookieHeader = request.headers.get('Cookie');
  const cookie = await apiConfigCookie.parse(cookieHeader);
  const apiKey = cookie?.apiKey || '';

  if (!apiKey) {
    return json(
      {
        message: 'Unauthorized',
        errors: ['Unauthorized'],
      },
      { status: 401 }
    );
  }

  const { content, previewText, from, to, replyTo, subject } = bodyData;
  const jsonContent = JSON.parse(content);
  const html = await render(jsonContent, {
    preview: previewText,
  });

  const resend = new Resend(apiKey);

  const enrichedTo = Array.isArray(to)
    ? to
    : to.split(',').map((email) => email.trim());
  const { error: sendError } = await resend.emails.send({
    to: enrichedTo,
    from,
    replyTo,
    subject,
    html,
  });

  if (sendError) {
    return json(
      {
        status: 500,
        message: sendError?.message,
        errors: [sendError.message],
      },
      { status: 500 }
    );
  }

  return { status: 'ok' };
}
