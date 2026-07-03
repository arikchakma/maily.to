import type { Route } from './+types/api.v1.templates.$templateId.duplicate';
import { z } from 'zod';
import { serializeZodError } from '~/lib/errors';
import { json } from '~/lib/response';
import { validateApiToken } from '~/lib/api-auth';
import { duplicateMockTemplate } from '~/lib/mock-templates';

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (!['POST'].includes(request.method)) {
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
  const duplicatedTemplate = duplicateMockTemplate(templateId);

  if (!duplicatedTemplate) {
    return json(
      { errors: [], message: 'Template not found', status: 404 },
      { status: 404 }
    );
  }

  return { template: duplicatedTemplate };
}
