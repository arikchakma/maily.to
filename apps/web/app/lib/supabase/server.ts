import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import type { Database } from '~/types/database';

export type SupabaseServerClient = ReturnType<typeof createServerClient<Database>>;

type CreateSupabaseServerClient = (
  request: Request,
  headers: Headers
) => SupabaseServerClient;

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
