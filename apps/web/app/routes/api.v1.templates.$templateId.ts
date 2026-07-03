import type { Route } from './+types/api.v1.templates.$templateId';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { validateApiToken } from '~/lib/api-auth';
import {
  getMockTemplateById,
  updateMockTemplate,
  deleteMockTemplate,
} from '~/lib/mock-templates';

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (!['POST', 'DELETE'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  // Validate bearer token
  const authError = validateApiToken(request);
  if (authError) return authError;

  const paramsSchema = z.object({
    templateId: z.string(),
  });
  const { data: paramsData, error: paramsError } =
    paramsSchema.safeParse(params);
  if (paramsError) {
    return serializeZodError(paramsError);
  }

  const { templateId } = paramsData;

  if (request.method === 'POST') {
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

    const existing = getMockTemplateById(templateId);
    if (!existing) {
      return json(
        { errors: [], message: 'Template not found', status: 404 },
        { status: 404 }
      );
    }

    const { title, previewText, content } = data;
    const updated = updateMockTemplate(templateId, { title, previewText, content });

    if (!updated) {
      return json(
        { errors: [], message: 'Failed to update template', status: 500 },
        { status: 500 }
      );
    }

    return { status: 'ok' };
  } else if (request.method === 'DELETE') {
    const deleted = deleteMockTemplate(templateId);

    if (!deleted) {
      return json(
        { errors: [], message: 'Failed to delete template', status: 500 },
        { status: 500 }
      );
    }

    return { status: 'ok' };
  }
}
