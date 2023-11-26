'use server';

import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';
import { cookies } from 'next/headers';
import { z } from 'zod';

const envelopeConfigSchema = z.object({
  apiKey: z.string().min(1, 'Please provide an API key'),
  endpoint: z.string(),
});

export async function envelopeConfigAction(formData: FormData) {
  try {
    const result = envelopeConfigSchema.safeParse({
      apiKey: formData.get('apiKey'),
      endpoint: formData.get('endpoint'),
    });

    if (!result.success) {
      return {
        data: null,
        error: {
          errors: result.error.issues,
          message: result.error.issues.map((issue) => issue.message).join(', '),
          code: 'validation_error',
        },
      };
    }

    const { apiKey, endpoint } = result.data;
    const cookieStore = cookies();
    cookieStore.set(ENVELOPE_API_KEY, apiKey);
    cookieStore.set(ENVELOPE_ENDPOINT, endpoint);

    return {
      data: {
        status: 'ok',
      },
      error: null,
    };
  } catch (e: unknown) {
    return {
      data: null,
      error: {
        message: (e as Error).message || 'Something went wrong',
        code: 'unknown_error',
      },
    };
  }
}
