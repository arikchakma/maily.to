import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates.$templateId';
import { redirect } from 'react-router';
import { z } from 'zod';

export async function action(args: Route.ActionArgs) {
  const { request, params } = args;
  if (!['POST', 'DELETE'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
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

  if (request.method === 'POST') {
    const body = await request.json();
    const schema = z.object({
      title: z.string().trim().min(3),
      previewText: z.string().trim().optional(),
      content: z.string(),
    });

    const { data, error } = schema.safeParse(body);
    if (error) {
      return { status: 400, message: error.message, errors: error.errors };
    }

    const { data: template } = await supabase
      .from('mails')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (!template) {
      return { errors: [], message: 'Template not found', status: 404 };
    }

    const { title, previewText, content } = data;
    const { error: updateError } = await supabase
      .from('mails')
      .update({ title, preview_text: previewText, content })
      .eq('id', templateId)
      .eq('user_id', user.id)
      .single();

    if (updateError) {
      return { errors: [], message: 'Failed to update template', status: 500 };
    }

    return { status: 'ok' };
  } else if (request.method === 'DELETE') {
    const { error } = await supabase
      .from('mails')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) {
      return { errors: [], message: 'Failed to delete template', status: 500 };
    }

    return { status: 'ok' };
  }
}
