export interface ActionErrorType {
  message: string;
  code: string;
  errors?: string[];
}

type ActionResponse<T> = T | { data: null; error: ActionErrorType };
type ActionFunction<T> = (formData: FormData) => Promise<ActionResponse<T>>;

export function catchActionError<T>(
  actionFn: ActionFunction<T>
): ActionFunction<T> {
  return async (formData: FormData) => {
    try {
      return await actionFn(formData);
    } catch (error) {
      return {
        data: null,
        error: {
          message: (error as Error).message || 'Something went wrong',
          code: 'unknown_error',
        },
      };
    }
  };
}

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${JSON.stringify(val)}`);
  }
}
