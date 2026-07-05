import type { Route } from './+types/api.v1.emails.inbox';
import { json } from '~/lib/response';
import { validateApiToken } from '~/lib/api-auth';
import { getInboundMessages } from '~/lib/mock-email-messages';

/**
 * GET /api/v1/emails/inbox
 * Fetches all inbound emails that may need replies
 */
export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  // Validate bearer token
  const authError = validateApiToken(request);
  if (authError) return authError;

  const messages = getInboundMessages();

  return json({
    messages,
    total: messages.length,
  });
}
