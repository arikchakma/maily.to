/**
 * Render a response with a JSON body
 *
 * @param response Object to be stringified
 * @param options Response options
 *
 * @returns Response
 */
export function json<T>(response: T, options: ResponseInit = {}): Response {
  const headers = new Headers(options?.headers);
  headers.set('content-type', 'application/json');

  return new Response(JSON.stringify(response), {
    status: options?.status || 200,
    headers,
  });
}
