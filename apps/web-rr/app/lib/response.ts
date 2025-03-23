/**
 * Render a response with a JSON body
 *
 * @param response Object to be stringified
 * @param options Response options
 *
 * @returns Response
 */
export function json<T>(response: T, options: ResponseInit = {}): Response {
  return new Response(JSON.stringify(response), {
    status: options?.status || 200,
    headers: {
      'content-type': 'application/json',
      ...options?.headers,
    },
  });
}
