import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/api.v1.templates._index';
import { redirect } from 'react-router';
import { z } from 'zod';

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
    return redirect('/login', { headers });
  }

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

  const { title, previewText, content } = data;
  const { error: insertError, data: insertData } = await supabase
    .from('mails')
    .insert({ title, preview_text: previewText, content, user_id: user.id })
    .select()
    .single();
  if (insertError) {
    return { errors: [], message: 'Failed to insert template', status: 500 };
  }

  return { template: insertData };
}
