
export function tryApiKeyAuth(requestHeaders: Headers) {
  const apiKey = requestHeaders.get('x-api-key');
  return apiKey === import.meta.env.VITE_MAILY_API_KEY;
}
