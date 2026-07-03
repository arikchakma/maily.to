import type { Route } from './+types/api.v1.templates._index';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { validateApiToken } from '~/lib/api-auth';
import { createMockTemplate } from '~/lib/mock-templates';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (!['POST'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  // Validate bearer token
  const authError = validateApiToken(request);
  if (authError) return authError;

  const body = await request.json();
  const schema = z.object({
    title: z.string().trim().min(3),
    previewText: z.string().trim().optional(),
    content: z.string(),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { title, previewText, content } = data;
  const template = createMockTemplate({ title, previewText, content });

  return { template };
}
