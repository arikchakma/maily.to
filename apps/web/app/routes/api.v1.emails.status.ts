import type { Route } from './+types/api.v1.emails.status';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { validateApiToken } from '~/lib/api-auth';
import { updateInboxStatus, getEmailMessageById } from '~/lib/mock-email-messages';

/**
 * POST /api/v1/emails/status
 * Updates the inbox status of an email message
 */
export async function action(args: Route.ActionArgs) {
  const { request } = args;

  if (request.method !== 'POST') {
    return json(
      { status: 405, message: 'Method Not Allowed', errors: [] },
      { status: 405 }
    );
  }

  // Validate bearer token
  const authError = validateApiToken(request);
  if (authError) return authError;

  const body = await request.json();
  const schema = z.object({
    messageId: z.number(),
    status: z.enum(['needs_reply', 'in_progress', 'replied', 'closed', 'spam']),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { messageId, status } = data;

  const message = getEmailMessageById(messageId);
  if (!message) {
    return json(
      { status: 404, message: 'Message not found', errors: [] },
      { status: 404 }
    );
  }

  const updated = updateInboxStatus(messageId, status);
  if (!updated) {
    return json(
      { status: 500, message: 'Failed to update status', errors: [] },
      { status: 500 }
    );
  }

  return json({
    success: true,
    message: 'Status updated',
    newStatus: status,
  });
}
