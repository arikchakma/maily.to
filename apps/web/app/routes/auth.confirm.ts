import { createSupabaseServerClient } from '~/lib/supabase/server';
import type { Route } from './+types/auth.callback';
import { data, redirect } from 'react-router';

export type EmailOtpType =
  | 'signup'
  | 'invite'
  | 'magiclink'
  | 'recovery'
  | 'email_change'
  | 'email';

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType;
  const next = searchParams.get('next') ?? '/templates';

  if (token_hash && type) {
    const headers = new Headers();
    const supabase = createSupabaseServerClient(request, headers);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      return redirect(next, {
        headers,
      });
    }
  }

  return data({ error: 'Invalid token' }, { status: 400 });
}
