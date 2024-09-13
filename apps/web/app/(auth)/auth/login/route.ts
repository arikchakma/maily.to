import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { config } from '@/lib/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const _provider = formData.get('provider');

  const schema = z.union([z.literal('github'), z.literal('google')]);
  const result = schema.safeParse(_provider);

  if (!result.success) {
    return NextResponse.redirect(requestUrl.origin, {
      status: 302,
    });
  }

  const provider = result.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${config.appUrl}/auth/callback`,
      ...(provider === 'google'
        ? {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          }
        : {}),
    },
  });

  if (!data.url) {
    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    });
  }

  return NextResponse.redirect(data.url, {
    status: 301,
  });
}
