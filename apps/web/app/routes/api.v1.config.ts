import { z } from 'zod';
import type { Route } from './+types/api.v1.emails.preview';
import { apiConfigCookie } from '~/lib/api-config.server';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const body = await request.json();
  const schema = z.object({
    provider: z.literal('resend'),
    apiKey: z.string().trim(),
  });

  const { data: bodyValue, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await apiConfigCookie.parse(cookieHeader)) ?? {};
  cookie.provider = bodyValue.provider;
  cookie.apiKey = bodyValue.apiKey;

  return json(
    { status: 'ok' },
    {
      status: 200,
      headers: {
        'Set-Cookie': await apiConfigCookie.serialize(cookie),
      },
    }
  );
}

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const cookieHeader = request.headers.get('Cookie');
  const cookie = await apiConfigCookie.parse(cookieHeader);
  const provider = cookie?.provider || 'resend';
  const apiKey = cookie?.apiKey || '';

  return { provider, apiKey };
}
