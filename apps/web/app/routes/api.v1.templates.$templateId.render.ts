import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates.$templateId';
import { z } from 'zod';
import { Maily } from '@maily-to/render';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { tryApiKeyAuth } from '~/lib/api-key-auth';

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (request.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiKeyAuth = tryApiKeyAuth(request.headers);

  if (!user && !isApiKeyAuth) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Unauthorized'],
      },
      {
        status: 401,
      }
    );
  }

  const paramsSchema = z.object({
    templateId: z.string(),
  });
  const { data: paramsData, error: paramsError } =
    paramsSchema.safeParse(params);
  if (paramsError) {
    return serializeZodError(paramsError);
  }

  const { templateId } = paramsData;

  const body = await request.json();
  const schema = z.object({
    variables: z.record(z.any()).optional(),
    repeatVariables: z.record(z.any()).optional(),
    previewText: z.string().optional(),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .match({
      id: templateId,
      ...(user ? { user_id: user.id } : {}),
    })
    .single();

  if (!template) {
    return json(
      { errors: [], message: 'Template not found', status: 404 },
      { status: 404 }
    );
  }

  const { variables, repeatVariables, previewText } = data;

  const parsedJson = JSON.parse(template.content as string);
  const maily = new Maily(parsedJson);

  if (variables) {
    maily.setVariableValues(variables);
  }

  if (repeatVariables) {
    maily.setPayloadValues(repeatVariables);
  }

  if (previewText || template.preview_text) {
    maily.setPreviewText(previewText || template.preview_text);
  }

  const html = await maily.render();
  const plainText = await maily.render({ plainText: true });

  return {
    html,
    plainText,
  };
}
