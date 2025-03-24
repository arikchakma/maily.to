import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import type { Database } from '~/types/database';

type CreateSupabaseServerClient = (
  request: Request,
  headers: Headers
) => ReturnType<typeof createServerClient<Database>>;

export const createSupabaseServerClient: CreateSupabaseServerClient = (
  request,
  headers
) => {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '') as {
            name: string;
            value: string;
          }[];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, {
                ...options,
                path: '/',
              })
            )
          );
        },
      },
    }
  );
};
