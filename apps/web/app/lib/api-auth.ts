import { json } from '~/lib/response';

/**
 * Validates the Authorization header against the API_ACCESS_TOKEN env variable.
 * Returns null if valid, or a 401 Response if invalid.
 *
 * Usage in API routes:
 * ```ts
 * const authError = validateApiToken(request);
 * if (authError) return authError;
 * ```
 */
export function validateApiToken(request: Request): Response | null {
  const authHeader = request.headers.get('Authorization');
  const expectedToken = process.env.API_ACCESS_TOKEN;

  // If no token is configured, allow all requests (fully open for local dev)
  if (!expectedToken) {
    return null;
  }

  if (!authHeader) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Missing Authorization header'],
      },
      { status: 401 }
    );
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || token !== expectedToken) {
    return json(
      {
        status: 401,
        message: 'Unauthorized',
        errors: ['Invalid token'],
      },
      { status: 401 }
    );
  }

  return null; // Valid
}

/**
 * A mock user ID used for local development when Supabase auth is disabled.
 */
export const MOCK_USER_ID = 'local-dev-user';
