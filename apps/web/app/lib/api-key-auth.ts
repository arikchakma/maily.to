export function tryApiKeyAuth(requestHeaders: Headers) {
  return requestHeaders.get('x-api-key') === import.meta.env.VITE_APP_API_KEY;
}
