import type { Route } from './+types/api.v1.emails.thread.$messageId';
import { json } from '~/lib/response';
import { validateApiToken } from '~/lib/api-auth';
import {
  getEmailMessageById,
  getEmailThread,
  getRecipientById,
  getReplyThreadingHeaders,
} from '~/lib/mock-email-messages';

/**
 * GET /api/v1/emails/thread/:messageId
 * Fetches an email message and its thread context for composing a reply
 */
export async function loader(args: Route.LoaderArgs) {
  const { request, params } = args;

  // Validate bearer token
  const authError = validateApiToken(request);
  if (authError) return authError;

  const messageId = parseInt(params.messageId, 10);
  if (isNaN(messageId)) {
    return json(
      { status: 400, message: 'Invalid message ID', errors: ['Invalid message ID'] },
      { status: 400 }
    );
  }

  const message = getEmailMessageById(messageId);
  if (!message) {
    return json(
      { status: 404, message: 'Message not found', errors: ['Message not found'] },
      { status: 404 }
    );
  }

  const thread = getEmailThread(messageId);
  const recipient = getRecipientById(message.campaign_recipient_id);
  const replyHeaders = getReplyThreadingHeaders(message);

  return json({
    message,
    thread,
    recipient,
    replyContext: {
      ...replyHeaders,
      fromEmail: 'kanika@email.gostudio.ai', // Your sending email
      fromName: 'Kanika from GoStudio.AI',
    },
  });
}
