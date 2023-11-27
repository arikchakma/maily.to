'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';
import { ActionError } from './error';

const envelopeConfigSchema = z.object({
  apiKey: z.string().min(1, 'Please provide an API key'),
  endpoint: z.string(),
});

// eslint-disable-next-line @typescript-eslint/require-await -- required for serverless functions
export async function envelopeConfigAction(formData: FormData) {
  const result = envelopeConfigSchema.safeParse({
    apiKey: formData.get('apiKey'),
    endpoint: formData.get('endpoint'),
  });

  if (!result.success) {
    throw new ActionError(
      result.error.issues.map((issue) => issue.message).join(', '),
      'validation_error',
      result.error.issues.map((issue) => issue.message)
    );
  }

  const { apiKey, endpoint } = result.data;
  const cookieStore = cookies();
  cookieStore.set(ENVELOPE_API_KEY, apiKey);
  cookieStore.set(ENVELOPE_ENDPOINT, endpoint);

  return {
    data: {
      apiKey,
      endpoint,
    },
    error: null,
  };
}
