type HttpOptionsType = RequestInit;

type AppResponse = Record<string, any>;

export class FetchError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  static isFetchError(error: any): error is FetchError {
    return error instanceof FetchError;
  }
}

type ApiReturn<ResponseType> = ResponseType;

/**
 * Wrapper around fetch to make it easy to handle errors
 *
 * @param url
 * @param options
 */
export async function httpCall<ResponseType = AppResponse>(
  url: string,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  const isMultiPartFormData = options?.body instanceof FormData;

  const headers = new Headers({
    Accept: 'application/json',
    ...(options?.headers ?? {}),
  });

  if (!isMultiPartFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  // @ts-expect-error Accept header is not defined in RequestInit
  const doesAcceptHtml = options?.headers?.['Accept'] === 'text/html';

  const data = doesAcceptHtml ? await response.text() : await response.json();

  // Logout user if token is invalid
  if (data.status === 401) {
    window.location.reload();
    return null as unknown as ApiReturn<ResponseType>;
  }

  if (!response.ok) {
    if ('errors' in data) {
      throw new FetchError(response.status, data.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  return data as ResponseType;
}

export async function httpPost<ResponseType = AppResponse>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  return httpCall<ResponseType>(url, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export async function httpGet<ResponseType = AppResponse>(
  url: string,
  queryParams?: Record<string, any>,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  const searchParams = new URLSearchParams(queryParams).toString();
  const queryUrl = searchParams ? `${url}?${searchParams}` : url;

  return httpCall<ResponseType>(queryUrl, options);
}

export async function httpPatch<ResponseType = AppResponse>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  return httpCall<ResponseType>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function httpPut<ResponseType = AppResponse>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  return httpCall<ResponseType>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function httpDelete<ResponseType = AppResponse>(
  url: string,
  options?: HttpOptionsType
): Promise<ApiReturn<ResponseType>> {
  return httpCall<ResponseType>(url, {
    ...options,
    method: 'DELETE',
  });
}
