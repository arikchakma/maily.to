'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  MAILY_API_KEY,
  MAILY_ENDPOINT,
  MAILY_PROVIDER,
} from '@/utils/constants';

const envelopeConfigSchema = z.object({
  provider: z.union([z.literal('resend'), z.literal('envelope')]),
  apiKey: z.string().min(1, 'Please provide an API key'),
  endpoint: z.string(),
});

// eslint-disable-next-line @typescript-eslint/require-await -- required for serverless functions
export async function envelopeConfigAction(formData: FormData) {
  const result = envelopeConfigSchema.safeParse({
    provider: formData.get('provider'),
    apiKey: formData.get('apiKey'),
    endpoint: formData.get('endpoint'),
  });

  if (!result.success) {
    return {
      data: null,
      error: {
        errors: result.error.issues.map((issue) => issue.message),
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
      },
    };
  }

  const { apiKey, endpoint, provider } = result.data;
  const cookieStore = cookies();
  cookieStore.set(MAILY_API_KEY, apiKey);
  cookieStore.set(MAILY_ENDPOINT, endpoint);
  cookieStore.set(MAILY_PROVIDER, provider);

  return {
    data: {
      apiKey,
      endpoint,
    },
    error: null,
  };
}
