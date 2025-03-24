import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates._index';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  if (!['POST'].includes(request.method)) {
    return { status: 405, message: 'Method Not Allowed', errors: [] };
  }

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Unauthorized'],
      },
      { status: 401 }
    );
  }

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
  const { error: insertError, data: insertData } = await supabase
    .from('mails')
    .insert({ title, preview_text: previewText, content, user_id: user.id })
    .select()
    .single();
  if (insertError) {
    return json(
      { errors: [], message: 'Failed to insert template', status: 500 },
      { status: 500 }
    );
  }

  return { template: insertData };
}
