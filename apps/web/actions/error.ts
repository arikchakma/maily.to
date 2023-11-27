export interface ActionErrorType {
  message: string;
  code: string;
  errors?: string[];
}

export class ActionError extends Error {
  code: string;
  errors?: string[];

  constructor(message: string, code: string, errors?: string[]) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
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
      if (error instanceof ActionError) {
        return {
          data: null,
          error: {
            message: error.message,
            code: error.code,
            errors: error.errors,
          },
        };
      }
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
