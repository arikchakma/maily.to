import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/auth.logout';
import { redirect } from 'react-router';

export async function action(args: Route.ActionArgs) {
  const { request } = args;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
  }

  await supabase.auth.signOut();
  return redirect('/templates', { headers });
}
