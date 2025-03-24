import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/auth.callback';
import { data, redirect } from 'react-router';

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const headers = new Headers();

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/templates';

  if (!code) {
    return data({ error: 'Invalid code' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient(request, headers);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) {
    return redirect(`${origin}${next}`, {
      headers,
    });
  }

  return data({ error: 'Invalid code' }, { status: 400, headers });
}
