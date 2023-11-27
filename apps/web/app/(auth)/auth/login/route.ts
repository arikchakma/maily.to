import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const _provider = formData.get('provider');

  const schema = z.union([z.literal('github'), z.literal('google')]);
  const result = schema.safeParse(_provider);

  if (!result.success) {
    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    });
  }

  const provider = result.data;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${config.appUrl}/auth/callback`,
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
