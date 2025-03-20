import { z } from 'zod';

const configSchema = z.object({
  appUrl: z.string(),
  supabase: z.object({
    url: z.string(),
    anonKey: z.string(),
  }),
});

export const config = configSchema.parse({
  appUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://maily.to'
      : 'http://localhost:3000',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
