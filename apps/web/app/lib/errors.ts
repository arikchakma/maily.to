import type { ZodError } from 'zod';
import { json } from './response';

export function serializeZodError(error: ZodError) {
  return json(
    {
      status: 400,
      message: error.errors?.map((e) => e.message)?.join(', '),
      errors: error?.errors || [],
    },
    {
      status: 400,
    }
  );
}
