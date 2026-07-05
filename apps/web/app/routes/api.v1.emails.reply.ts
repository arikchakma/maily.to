import type { Route } from './+types/api.v1.emails.reply';
import { z } from 'zod';
import { json } from '~/lib/response';
import { serializeZodError } from '~/lib/errors';
import { validateApiToken } from '~/lib/api-auth';
import {
  getEmailMessageById,
  getEmailThread,
  getReplyThreadingHeaders,
  generateQuotedReply,
  saveSentReply,
  type EmailMessage,
} from '~/lib/mock-email-messages';

/**
 * POST /api/v1/emails/reply
 * Sends a reply to an email with proper threading headers
 * 
 * In production, this would:
 * 1. Call Resend API with threading headers
 * 2. Save the sent message to your email_messages table
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
    replyToMessageId: z.number(),
    subject: z.string().min(1),
    htmlContent: z.string().min(1),
    includeQuotedThread: z.boolean().default(true),
  });

  const { data, error } = schema.safeParse(body);
  if (error) {
    return serializeZodError(error);
  }

  const { replyToMessageId, subject, htmlContent, includeQuotedThread } = data;

  // Get the original message we're replying to
  const originalMessage = getEmailMessageById(replyToMessageId);
  if (!originalMessage) {
    return json(
      { status: 404, message: 'Original message not found', errors: [] },
      { status: 404 }
    );
  }

  // Get threading headers
  const threadingHeaders = getReplyThreadingHeaders(originalMessage);
  
  // Get the full thread for quoted reply
  const thread = getEmailThread(replyToMessageId);
  const quotedReply = includeQuotedThread ? generateQuotedReply(thread) : '';

  // Combine the new reply with quoted thread
  const fullHtml = `
    <div>
      ${htmlContent}
    </div>
    ${quotedReply}
  `;

  // In production, you would call Resend here:
  // 
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const result = await resend.emails.send({
  //   from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
  //   to: threadingHeaders.to,
  //   subject: threadingHeaders.subject,
  //   html: fullHtml,
  //   headers: {
  //     'In-Reply-To': threadingHeaders.inReplyTo,
  //     'References': threadingHeaders.references,
  //   },
  // });

  // For demo, we'll simulate the send and save to mock storage
  const newMessageId = `<reply-${Date.now()}@email.gostudio.ai>`;
  
  const sentReply = saveSentReply({
    campaign_id: originalMessage.campaign_id,
    campaign_recipient_id: originalMessage.campaign_recipient_id,
    user_id: originalMessage.user_id,
    user_email: originalMessage.user_email,
    direction: 'outbound',
    message_type: 'manual_reply',
    sequence_step: null,
    subject: threadingHeaders.subject,
    body_text: null,
    body_html: fullHtml,
    status: 'sent',
    sent_at: new Date().toISOString(),
    received_at: null,
    metadata: {
      is_manual_reply: true,
      replied_to_message_id: replyToMessageId,
    },
    raw_payload: {
      message_id: newMessageId,
      headers: {
        'message-id': newMessageId,
        'in-reply-to': threadingHeaders.inReplyTo,
        'references': threadingHeaders.references,
        from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
        to: threadingHeaders.to,
        subject: threadingHeaders.subject,
      },
    },
  });

  // Log what would be sent to Resend (for debugging)
  console.log('=== REPLY EMAIL (would be sent to Resend) ===');
  console.log('To:', threadingHeaders.to);
  console.log('Subject:', threadingHeaders.subject);
  console.log('In-Reply-To:', threadingHeaders.inReplyTo);
  console.log('References:', threadingHeaders.references);
  console.log('==============================================');

  return json({
    success: true,
    message: 'Reply sent successfully',
    sentMessage: sentReply,
    // Include what would be sent to Resend for verification
    resendPayload: {
      from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
      to: threadingHeaders.to,
      subject: threadingHeaders.subject,
      headers: {
        'In-Reply-To': threadingHeaders.inReplyTo,
        'References': threadingHeaders.references,
      },
    },
  });
}
