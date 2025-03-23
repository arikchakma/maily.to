import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates.$templateId.duplicate';
import { z } from 'zod';

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (!['POST'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 401,
      message: 'Unauthorized',
      errors: ['Unauthorized'],
    };
  }

  const paramsSchema = z.object({
    templateId: z.string(),
  });
  const { data: paramsData, error: paramsError } =
    paramsSchema.safeParse(params);
  if (paramsError) {
    return {
      status: 400,
      message: paramsError.message,
      errors: paramsError.errors,
    };
  }

  const { templateId } = paramsData;

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    return { errors: [], message: 'Template not found', status: 404 };
  }

  const { data: duplicatedTemplate, error: duplicateError } = await supabase
    .from('mails')
    .insert({
      title: `[DUPLICATE] ${template.title}`,
      preview_text: template.preview_text,
      content: template.content,
      user_id: user.id,
    })
    .select()
    .single();

  if (duplicateError) {
    return {
      status: 500,
      message: 'Failed to duplicate template',
      errors: [duplicateError],
    };
  }

  return { template: duplicatedTemplate };
}
