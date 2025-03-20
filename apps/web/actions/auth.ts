'use server';

import { z } from 'zod';
import { config } from '@/lib/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const emailLoginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export async function emailLoginAction(formData: FormData) {
  const result = emailLoginSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
  }

  const { email } = result.data;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${config.appUrl}/auth/callback`,
    },
  });

  if (error) {
    return {
      data: null,
      error: {
        message: error.message,
        code: error.status,
        errors: [error.message],
      },
    };
  }

  return {
    data: {
      status: 'ok',
    },
    error: null,
  };
}
