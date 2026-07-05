/**
 * Mock email messages data - simulates your email_messages table
 * This will be replaced with actual database queries in production
 */

export type InboxStatus = 'needs_reply' | 'in_progress' | 'replied' | 'closed' | 'spam';

export interface EmailMessage {
  id: number;
  campaign_id: number;
  campaign_recipient_id: number;
  user_id: string;
  user_email: string;
  direction: 'outbound' | 'inbound';
  message_type: string;
  sequence_step: number | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  status: string;
  inbox_status?: InboxStatus; // For tracking reply status in admin
  sent_at: string | null;
  received_at: string | null;
  metadata: Record<string, any>;
  raw_payload: {
    message_id?: string;
    headers?: {
      'message-id'?: string;
      'in-reply-to'?: string;
      'references'?: string;
      from?: string;
      to?: string;
      subject?: string;
    };
    html?: string;
    text?: string;
    from?: string;
    to?: string[];
  };
  created_at: string;
}

export interface EmailRecipient {
  id: number;
  campaign_id: number;
  user_id: string;
  user_email: string;
  first_name: string | null;
  campaign_status: string;
}

// Mock data based on your actual Resend webhook payload
const MOCK_EMAIL_MESSAGES: EmailMessage[] = [
  // Original outbound email (your campaign email)
  {
    id: 1,
    campaign_id: 1,
    campaign_recipient_id: 1,
    user_id: '0f81d620-9590-492d-8d62-e36266e55181',
    user_email: 'mait@btinternet.com',
    direction: 'outbound',
    message_type: 'paid_user_feedback_initial',
    sequence_step: 1,
    subject: 'Hope you liked your Photos at GoStudio.ai - Quick Chat?',
    body_text: null,
    body_html: `<div class="email-wrapper">
      <table class="email-container" cellpadding="0" cellspacing="0" role="presentation">
        <tbody>
          <tr>
            <td class="body-content">
              <p class="greeting">Hi Maria,</p>
              <p>
                I saw that you used GoStudio.AI for Image Edit, did the product meet your expectations?
                Is there anything that did not work for you. Feel free to reply here and I would get that sorted.
              </p>
              <span class="ps-line">
                PS: This is not AI Agent written. I reach out to each of my customers myself – just like the old days
              </span>
            </td>
          </tr>
          <tr>
            <td class="signature">
              <p class="signature-name">Kanika</p>
              <p class="signature-title">Founder, GoStudio.ai</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
    status: 'delivered',
    sent_at: '2026-07-03T07:17:00.000Z',
    received_at: null,
    metadata: {},
    raw_payload: {
      message_id: '<0100019f269fa76a-965e38b2-ea29-474e-9b7e-8ebf3fe935de-000000@email.amazonses.com>',
      headers: {
        'message-id': '<0100019f269fa76a-965e38b2-ea29-474e-9b7e-8ebf3fe935de-000000@email.amazonses.com>',
        from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
        to: 'mait@btinternet.com',
        subject: 'Hope you liked your Photos at GoStudio.ai - Quick Chat?',
      },
    },
    created_at: '2026-07-03T07:17:00.000Z',
  },
  // Inbound reply from user (Maria's response)
  {
    id: 2,
    campaign_id: 1,
    campaign_recipient_id: 1,
    user_id: '0f81d620-9590-492d-8d62-e36266e55181',
    user_email: 'mait@btinternet.com',
    direction: 'inbound',
    message_type: 'user_reply',
    sequence_step: null,
    subject: 'Re: Hope you liked your Photos at GoStudio.ai - Quick Chat?',
    body_text: 'Hi\nThanks for your email. The background to my image changed and I wanted it to stay the same. How can I do that please?\n\nRegards\nMaria Thwaite',
    body_html: `<html class="apple-mail-supports-explicit-dark-mode"><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body dir="auto">Hi<div>Thanks for your email. The background to my image changed and I wanted it to stay the same. How can I do that please?</div><div><br></div><div>Regards&nbsp;<br id="lineBreakAtBeginningOfSignature"><div dir="ltr">Maria Thwaite&nbsp;<div><div>Sent from my iPad</div></div></div></div></body></html>`,
    status: 'received',
    inbox_status: 'needs_reply',
    sent_at: null,
    received_at: '2026-07-03T09:11:38.293Z',
    metadata: {},
    raw_payload: {
      message_id: '<6C0A516D-51E8-4A60-BE43-432533610DC2@btinternet.com>',
      headers: {
        'message-id': '<6C0A516D-51E8-4A60-BE43-432533610DC2@btinternet.com>',
        'in-reply-to': '<0100019f269fa76a-965e38b2-ea29-474e-9b7e-8ebf3fe935de-000000@email.amazonses.com>',
        'references': '<0100019f269fa76a-965e38b2-ea29-474e-9b7e-8ebf3fe935de-000000@email.amazonses.com>',
        from: '"Maria" <mait@btinternet.com>',
        to: 'kbhatt@email.gostudio.ai',
        subject: 'Re: Hope you liked your Photos at GoStudio.ai - Quick Chat?',
      },
      html: `<html class="apple-mail-supports-explicit-dark-mode"><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body dir="auto">Hi<div>Thanks for your email. The background to my image changed and I wanted it to stay the same. How can I do that please?</div><div><br></div><div>Regards&nbsp;<br id="lineBreakAtBeginningOfSignature"><div dir="ltr">Maria Thwaite&nbsp;<div><div>Sent from my iPad</div></div></div></div></body></html>`,
      text: 'Hi\nThanks for your email. The background to my image changed and I wanted it to stay the same. How can I do that please?\n\nRegards\nMaria Thwaite',
      from: 'mait@btinternet.com',
      to: ['kbhatt@email.gostudio.ai'],
    },
    created_at: '2026-07-03T09:11:38.293Z',
  },
  // Another inbound email - support question (forwarded from ProtonMail)
  {
    id: 3,
    campaign_id: 1,
    campaign_recipient_id: 2,
    user_id: 'user-456',
    user_email: 'john.doe@gmail.com',
    direction: 'inbound',
    message_type: 'user_reply',
    sequence_step: null,
    subject: 'Question about pricing',
    body_text: 'Hi there,\n\nI was looking at your pricing page and had a question about the Pro plan. Does it include unlimited exports?\n\nThanks,\nJohn',
    body_html: `<div>Hi there,</div><div><br></div><div>I was looking at your pricing page and had a question about the Pro plan. Does it include unlimited exports?</div><div><br></div><div>Thanks,</div><div>John</div>`,
    status: 'received',
    inbox_status: 'needs_reply',
    sent_at: null,
    received_at: '2026-07-03T14:30:00.000Z',
    metadata: {
      forwarded_from: 'support@gostudio.ai',
      original_to: 'support@gostudio.ai',
    },
    raw_payload: {
      message_id: '<CAH2=unique123@mail.gmail.com>',
      headers: {
        'message-id': '<CAH2=unique123@mail.gmail.com>',
        from: 'John Doe <john.doe@gmail.com>',
        to: 'support@gostudio.ai',
        subject: 'Question about pricing',
      },
      html: `<div>Hi there,</div><div><br></div><div>I was looking at your pricing page and had a question about the Pro plan. Does it include unlimited exports?</div><div><br></div><div>Thanks,</div><div>John</div>`,
      text: 'Hi there,\n\nI was looking at your pricing page and had a question about the Pro plan. Does it include unlimited exports?\n\nThanks,\nJohn',
      from: 'john.doe@gmail.com',
      to: ['support@gostudio.ai'],
    },
    created_at: '2026-07-03T14:30:00.000Z',
  },
  // An already replied message
  {
    id: 4,
    campaign_id: 1,
    campaign_recipient_id: 3,
    user_id: 'user-789',
    user_email: 'sarah@company.com',
    direction: 'inbound',
    message_type: 'user_reply',
    sequence_step: null,
    subject: 'Re: Your recent order',
    body_text: 'Thanks for the quick response! That answers my question.',
    body_html: `<div>Thanks for the quick response! That answers my question.</div>`,
    status: 'received',
    inbox_status: 'closed',
    sent_at: null,
    received_at: '2026-07-02T10:00:00.000Z',
    metadata: {},
    raw_payload: {
      message_id: '<xyz789@company.com>',
      headers: {
        'message-id': '<xyz789@company.com>',
        from: 'Sarah <sarah@company.com>',
        to: 'kanika@email.gostudio.ai',
        subject: 'Re: Your recent order',
      },
      html: `<div>Thanks for the quick response! That answers my question.</div>`,
      text: 'Thanks for the quick response! That answers my question.',
      from: 'sarah@company.com',
      to: ['kanika@email.gostudio.ai'],
    },
    created_at: '2026-07-02T10:00:00.000Z',
  },
];

const MOCK_RECIPIENTS: EmailRecipient[] = [
  {
    id: 1,
    campaign_id: 1,
    user_id: '0f81d620-9590-492d-8d62-e36266e55181',
    user_email: 'mait@btinternet.com',
    first_name: 'Maria',
    campaign_status: 'replied',
  },
  {
    id: 2,
    campaign_id: 1,
    user_id: 'user-456',
    user_email: 'john.doe@gmail.com',
    first_name: 'John',
    campaign_status: 'pending',
  },
  {
    id: 3,
    campaign_id: 1,
    user_id: 'user-789',
    user_email: 'sarah@company.com',
    first_name: 'Sarah',
    campaign_status: 'replied',
  },
];



/**
 * Get all inbound messages that need replies
 */
export function getInboundMessages(): EmailMessage[] {
  return MOCK_EMAIL_MESSAGES.filter((m) => m.direction === 'inbound').sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Get a specific email message by ID
 */
export function getEmailMessageById(id: number): EmailMessage | undefined {
  return MOCK_EMAIL_MESSAGES.find((m) => m.id === id);
}

/**
 * Get the full email thread for a message (all messages in the same conversation)
 */
export function getEmailThread(messageId: number): EmailMessage[] {
  const message = getEmailMessageById(messageId);
  if (!message) return [];

  // Get all messages for the same recipient
  return MOCK_EMAIL_MESSAGES.filter(
    (m) => m.campaign_recipient_id === message.campaign_recipient_id
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

/**
 * Get recipient info
 */
export function getRecipientById(id: number): EmailRecipient | undefined {
  return MOCK_RECIPIENTS.find((r) => r.id === id);
}

/**
 * Extract threading headers for reply
 */
export function getReplyThreadingHeaders(inboundMessage: EmailMessage): {
  inReplyTo: string;
  references: string;
  subject: string;
  to: string;
  toName: string | null;
} {
  const headers = inboundMessage.raw_payload.headers || {};
  const messageId = headers['message-id'] || inboundMessage.raw_payload.message_id || '';
  
  // Build references chain
  const existingRefs = headers['references'] || '';
  const references = existingRefs ? `${existingRefs} ${messageId}` : messageId;

  // Parse "From" to get email and name
  const fromHeader = headers.from || inboundMessage.user_email;
  const nameMatch = fromHeader.match(/^"?([^"<]+)"?\s*<([^>]+)>/);
  const toName = nameMatch ? nameMatch[1].trim() : null;
  const toEmail = nameMatch ? nameMatch[2] : fromHeader.replace(/[<>]/g, '');

  // Ensure subject has Re: prefix
  let subject = inboundMessage.subject || '';
  if (!subject.toLowerCase().startsWith('re:')) {
    subject = `Re: ${subject}`;
  }

  return {
    inReplyTo: messageId,
    references,
    subject,
    to: toEmail,
    toName,
  };
}

/**
 * Format date for email quote header
 */
export function formatEmailDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate quoted reply HTML
 */
export function generateQuotedReply(thread: EmailMessage[]): string {
  if (thread.length === 0) return '';

  const quotes = thread
    .slice()
    .reverse()
    .map((msg) => {
      const date = formatEmailDate(msg.created_at);
      const from = msg.direction === 'outbound' 
        ? 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>'
        : msg.raw_payload.headers?.from || msg.user_email;
      
      const content = msg.body_html || msg.body_text || '';
      
      return `
        <div style="padding-left: 10px; border-left: 2px solid #ccc; margin: 16px 0; color: #666;">
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">
            On ${date}, ${from} wrote:
          </p>
          <div style="font-size: 14px;">
            ${content}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div style="margin-top: 24px;">
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      ${quotes}
    </div>
  `;
}

// In-memory storage for sent replies (for demo purposes)
let replyIdCounter = 100;
const sentReplies: EmailMessage[] = [];

/**
 * Update inbox status for a message
 */
export function updateInboxStatus(messageId: number, status: InboxStatus): boolean {
  const message = MOCK_EMAIL_MESSAGES.find((m) => m.id === messageId);
  if (!message) return false;
  message.inbox_status = status;
  return true;
}

/**
 * Get inbox messages filtered by status
 */
export function getInboxByStatus(status?: InboxStatus): EmailMessage[] {
  const inbound = MOCK_EMAIL_MESSAGES.filter((m) => m.direction === 'inbound');
  if (!status) return inbound;
  return inbound.filter((m) => m.inbox_status === status);
}

/**
 * Get counts by inbox status
 */
export function getInboxCounts(): Record<InboxStatus | 'all', number> {
  const inbound = MOCK_EMAIL_MESSAGES.filter((m) => m.direction === 'inbound');
  return {
    all: inbound.length,
    needs_reply: inbound.filter((m) => m.inbox_status === 'needs_reply').length,
    in_progress: inbound.filter((m) => m.inbox_status === 'in_progress').length,
    replied: inbound.filter((m) => m.inbox_status === 'replied').length,
    closed: inbound.filter((m) => m.inbox_status === 'closed').length,
    spam: inbound.filter((m) => m.inbox_status === 'spam').length,
  };
}

/**
 * Save a sent reply (mock - in production this goes to your DB)
 */
export function saveSentReply(reply: Omit<EmailMessage, 'id' | 'created_at'>): EmailMessage {
  const newReply: EmailMessage = {
    ...reply,
    id: replyIdCounter++,
    created_at: new Date().toISOString(),
  };
  sentReplies.push(newReply);
  MOCK_EMAIL_MESSAGES.push(newReply);
  return newReply;
}
