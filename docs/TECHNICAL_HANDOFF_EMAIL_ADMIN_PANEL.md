# Technical Handoff: Email Admin Panel with Threaded Reply System

**Document Version:** 1.0  
**Created:** July 3, 2026  
**Author:** AI Assistant (with product requirements from Karan Bhatt)  
**Status:** Ready for Development Migration  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Architecture](#4-architecture)
5. [Database Schema](#5-database-schema)
6. [API Specifications](#6-api-specifications)
7. [Email Threading Implementation](#7-email-threading-implementation)
8. [Frontend Components](#8-frontend-components)
9. [ProtonMail Integration](#9-protonmail-integration)
10. [Migration Guide](#10-migration-guide)
11. [Trade-offs & Decisions](#11-trade-offs--decisions)
12. [Security Considerations](#12-security-considerations)
13. [Testing Checklist](#13-testing-checklist)
14. [Future Enhancements](#14-future-enhancements)

---

## 1. Executive Summary

### What We Built
A unified email admin panel that allows the marketing/support team to:
- View all inbound customer emails in one place (regardless of which address they wrote to)
- Compose and send replies using a visual email editor (Maily)
- Maintain proper email threading so replies appear in the same conversation in Gmail, Apple Mail, and Outlook
- Track conversation status (needs reply, in progress, replied, closed)

### Why It Matters
Previously, customer communication was fragmented:
- Automated campaign emails went through Resend (`email.gostudio.ai`)
- Support emails went to ProtonMail (`support@gostudio.ai`)
- Coordination happened manually in Slack
- Risk of sending automated follow-ups after manual conversations

### Key Outcome
Single source of truth for all customer email communication with proper threading support.

---

## 2. Problem Statement

### Current State (Before)
```
┌─────────────────────────────────────────────────────────────────┐
│  FRAGMENTED EMAIL CHANNELS                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Automated Campaigns          Manual Support                     │
│  (Resend)                     (ProtonMail)                       │
│  ─────────────────           ──────────────                      │
│  kanika@email.gostudio.ai    support@gostudio.ai                │
│  mail.gostudio.ai            personal emails                     │
│         │                            │                           │
│         ▼                            ▼                           │
│  email_messages table         ProtonMail inbox                   │
│         │                            │                           │
│         └──────────┬─────────────────┘                           │
│                    ▼                                             │
│              Slack (manual sync)                                 │
│              ❌ No single source of truth                        │
│              ❌ Risk of duplicate/conflicting emails             │
│              ❌ Manual campaign pause required                   │
└─────────────────────────────────────────────────────────────────┘
```

### Problems Identified
1. **No unified view** - Team must check multiple inboxes
2. **Threading broken** - Manual replies from ProtonMail don't thread properly with campaign emails
3. **Campaign conflicts** - Automated follow-ups may send after customer already replied to support
4. **No audit trail** - Difficult to see full conversation history with a customer
5. **Manual coordination** - Slack-based sync doesn't scale

---

## 3. Solution Overview

### Target State (After)
```
┌─────────────────────────────────────────────────────────────────┐
│  UNIFIED EMAIL SYSTEM                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Customer sends email to ANY address                             │
│  (support@, kanika@, or replies to campaigns)                    │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              ProtonMail (optional view)                  │    │
│  │                        │                                 │    │
│  │                        │ Auto-forward                    │    │
│  │                        ▼                                 │    │
│  │         support-inbound@mail.gostudio.ai                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                    │                                             │
│                    │ Resend Webhook                              │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   YOUR BACKEND                           │    │
│  │  1. Save to email_messages table                        │    │
│  │  2. Auto-pause campaign if sender in active sequence    │    │
│  │  3. Notify Slack (optional)                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              ADMIN PANEL (this implementation)           │    │
│  │                                                          │    │
│  │  • Unified inbox with status tracking                   │    │
│  │  • Visual email composer (Maily editor)                 │    │
│  │  • Threaded replies via Resend                          │    │
│  │  • Full conversation history                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features Implemented
| Feature | Description | Status |
|---------|-------------|--------|
| Unified Inbox | List all inbound emails with status filtering | ✅ Complete |
| Status Management | Track: needs_reply, in_progress, replied, closed, spam | ✅ Complete |
| Visual Reply Composer | Maily editor with signature template | ✅ Complete |
| Email Threading | Proper In-Reply-To and References headers | ✅ Complete |
| Conversation History | View full thread before replying | ✅ Complete |
| Quick Actions | Close, mark spam, mark in progress | ✅ Complete |

---

## 4. Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /inbox                    /inbox/reply/:id                      │
│  ┌──────────────────┐     ┌──────────────────────────────────┐  │
│  │ Message List     │     │ Reply Composer                   │  │
│  │ - Status tabs    │     │ - Maily Editor                   │  │
│  │ - Search/filter  │     │ - Thread preview                 │  │
│  │ - Quick preview  │     │ - Status actions                 │  │
│  └──────────────────┘     └──────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP + Bearer Token Auth
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (API Routes)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET  /api/v1/emails/inbox           - List inbound emails      │
│  GET  /api/v1/emails/thread/:id      - Get message + thread     │
│  POST /api/v1/emails/reply           - Send threaded reply      │
│  POST /api/v1/emails/status          - Update message status    │
│  POST /api/v1/emails/preview         - Render HTML preview      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      PostgreSQL          │    │        Resend API        │
│  (email_messages table)  │    │   (send with headers)    │
└──────────────────────────┘    └──────────────────────────┘
```

### Data Flow: Receiving Email

```
1. Customer sends email to support@gostudio.ai
2. ProtonMail receives it (you see it in your inbox)
3. ProtonMail auto-forwards to support-inbound@mail.gostudio.ai
4. Resend receives and triggers webhook to your API
5. Your webhook handler:
   a. Parses the payload (from, subject, html, headers)
   b. Extracts Message-ID, In-Reply-To, References
   c. Finds or creates campaign_recipient record
   d. Saves to email_messages table
   e. If sender has is_sequence_active=true, pauses their campaign
   f. Optionally notifies Slack
6. Email appears in Admin Panel inbox
```

### Data Flow: Sending Reply

```
1. Admin opens message in /inbox/reply/:id
2. Admin composes reply using Maily editor
3. Admin clicks "Send Reply"
4. Frontend:
   a. Calls /api/v1/emails/preview to render HTML
   b. Calls /api/v1/emails/reply with content + messageId
5. Backend:
   a. Loads original message to get threading headers
   b. Builds In-Reply-To and References headers
   c. Optionally appends quoted conversation
   d. Calls Resend API with headers
   e. Saves sent message to email_messages
   f. Updates inbox_status to 'replied'
6. Email arrives in customer's inbox, threaded with conversation
```

---

## 5. Database Schema

### Existing Tables (No Changes Required)

```sql
-- Already exists in your system
CREATE TABLE email_messages (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES email_campaigns(id),
  campaign_recipient_id INTEGER NOT NULL REFERENCES email_campaign_recipients(id),
  user_id UUID,
  user_email TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  message_type TEXT NOT NULL,
  sequence_step INTEGER,
  subject TEXT,
  body_text TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  complained_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  raw_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Recommended Schema Addition

```sql
-- Add inbox_status column for admin panel tracking
ALTER TABLE email_messages 
ADD COLUMN inbox_status TEXT DEFAULT 'needs_reply'
CHECK (inbox_status IN ('needs_reply', 'in_progress', 'replied', 'closed', 'spam'));

-- Add index for inbox queries
CREATE INDEX idx_email_messages_inbox_status 
ON email_messages(inbox_status, created_at DESC)
WHERE direction = 'inbound';

-- Add body_html column if not exists (for storing rendered HTML)
ALTER TABLE email_messages 
ADD COLUMN IF NOT EXISTS body_html TEXT;
```

### Required Schema Change: `manual_reply` message_type

The production `message_type` CHECK constraint only allows: `paid_user_feedback_initial`, `paid_user_feedback_followup`, `post_purchase_initial`, `post_purchase_followup`, `user_reply`. There is no type for admin-composed replies sent from this panel. Storing a sent reply as `paid_user_feedback_followup` (as an earlier draft of this doc suggested) would misclassify it as an automated sequence step and pollute sequence-step analytics. Add a dedicated value instead:

```sql
ALTER TABLE email_messages DROP CONSTRAINT email_messages_message_type_check;
ALTER TABLE email_messages ADD CONSTRAINT email_messages_message_type_check
  CHECK (message_type = ANY (ARRAY[
    'paid_user_feedback_initial','paid_user_feedback_followup',
    'post_purchase_initial','post_purchase_followup',
    'user_reply','manual_reply'
  ]::text[]));
```

`sequence_step` should be `NULL` for these rows. The unique index `email_messages_recipient_step_uidx` on `(campaign_recipient_id, sequence_step) WHERE direction='outbound' AND status<>'failed'` treats NULLs as distinct, so multiple manual replies to the same recipient will not collide with it.

### Important: raw_payload Structure

The `raw_payload` JSONB column stores the full Resend webhook payload. Critical fields for threading:

```json
{
  "message_id": "<unique-id@domain.com>",
  "headers": {
    "message-id": "<unique-id@domain.com>",
    "in-reply-to": "<previous-message-id@domain.com>",
    "references": "<chain of message-ids>",
    "from": "\"Name\" <email@domain.com>",
    "to": "recipient@domain.com",
    "subject": "Re: Original subject"
  },
  "html": "...",
  "text": "...",
  "from": "email@domain.com",
  "to": ["recipient@domain.com"]
}
```

---

## 6. API Specifications

### Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <API_ACCESS_TOKEN>
```

Token is validated against `API_ACCESS_TOKEN` environment variable.

### GET /api/v1/emails/inbox

**Purpose:** List all inbound emails for the admin inbox

**Request:**
```
GET /api/v1/emails/inbox
Authorization: Bearer <token>
```

**Response:**
```json
{
  "messages": [
    {
      "id": 2,
      "campaign_id": 1,
      "campaign_recipient_id": 1,
      "user_email": "customer@example.com",
      "direction": "inbound",
      "subject": "Re: Your campaign email",
      "body_text": "Hi, thanks for reaching out...",
      "body_html": "<div>Hi, thanks for reaching out...</div>",
      "inbox_status": "needs_reply",
      "received_at": "2026-07-03T09:11:38.293Z",
      "metadata": {
        "forwarded_from": "support@gostudio.ai"
      },
      "raw_payload": { ... }
    }
  ],
  "total": 1
}
```

### GET /api/v1/emails/thread/:messageId

**Purpose:** Get a specific message with full thread context for reply composition

**Request:**
```
GET /api/v1/emails/thread/2
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": { /* EmailMessage object */ },
  "thread": [ /* Array of all messages in conversation, chronological */ ],
  "recipient": {
    "id": 1,
    "user_email": "customer@example.com",
    "first_name": "Maria",
    "campaign_status": "replied"
  },
  "replyContext": {
    "inReplyTo": "<message-id-of-email-being-replied-to>",
    "references": "<chain of all message-ids in thread>",
    "subject": "Re: Original subject",
    "to": "customer@example.com",
    "toName": "Maria",
    "fromEmail": "kanika@email.gostudio.ai",
    "fromName": "Kanika from GoStudio.AI"
  }
}
```

### POST /api/v1/emails/reply

**Purpose:** Send a reply with proper threading headers

**Request:**
```json
POST /api/v1/emails/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "replyToMessageId": 2,
  "subject": "Re: Your question",
  "htmlContent": "<div>Hi Maria,<br><br>Thanks for reaching out...</div>",
  "includeQuotedThread": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "sentMessage": { /* EmailMessage object for the sent reply */ },
  "resendPayload": {
    "from": "Kanika from GoStudio.AI <kanika@email.gostudio.ai>",
    "to": "customer@example.com",
    "subject": "Re: Your question",
    "headers": {
      "In-Reply-To": "<original-message-id>",
      "References": "<chain-of-message-ids>"
    }
  }
}
```

### POST /api/v1/emails/status

**Purpose:** Update inbox status of a message

**Request:**
```json
POST /api/v1/emails/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "messageId": 2,
  "status": "closed"  // "needs_reply" | "in_progress" | "replied" | "closed" | "spam"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated",
  "newStatus": "closed"
}
```

---

## 7. Email Threading Implementation

### How Email Threading Works

Email clients (Gmail, Apple Mail, Outlook) group messages into conversations using these headers:

| Header | Purpose | Example |
|--------|---------|---------|
| `Message-ID` | Unique identifier for this email | `<abc123@mail.example.com>` |
| `In-Reply-To` | Message-ID of the email being replied to | `<xyz789@mail.example.com>` |
| `References` | Space-separated list of all Message-IDs in thread | `<first@ex.com> <second@ex.com>` |
| `Subject` | Must match (with optional `Re:` prefix) | `Re: Original subject` |

### Building Threading Headers for Reply

```typescript
function getReplyThreadingHeaders(inboundMessage: EmailMessage) {
  const headers = inboundMessage.raw_payload.headers || {};
  
  // The message we're replying to
  const messageId = headers['message-id'] || inboundMessage.raw_payload.message_id;
  
  // Build references chain: existing references + current message-id
  const existingRefs = headers['references'] || '';
  const references = existingRefs 
    ? `${existingRefs} ${messageId}` 
    : messageId;

  // Ensure subject has Re: prefix
  let subject = inboundMessage.subject || '';
  if (!subject.toLowerCase().startsWith('re:')) {
    subject = `Re: ${subject}`;
  }

  return {
    inReplyTo: messageId,      // Points to the message we're replying to
    references: references,     // Full chain for threading
    subject: subject,
  };
}
```

### Sending with Resend

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
  to: recipientEmail,
  subject: threadingHeaders.subject,
  html: htmlContent,
  headers: {
    'In-Reply-To': threadingHeaders.inReplyTo,
    'References': threadingHeaders.references,
  },
});
```

### Quoted Reply Format

For professional appearance, include the previous conversation:

```html
<div>
  <!-- New reply content -->
  <p>Hi Maria,</p>
  <p>Thanks for your question...</p>
</div>

<div style="margin-top: 24px;">
  <hr style="border: none; border-top: 1px solid #e5e5e5;" />
  
  <div style="padding-left: 10px; border-left: 2px solid #ccc; margin: 16px 0; color: #666;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">
      On Jul 3, 2026, Maria wrote:
    </p>
    <div style="font-size: 14px;">
      <!-- Original message content -->
    </div>
  </div>
</div>
```

---

## 8. Frontend Components

### File Structure

```
apps/web/app/
├── routes/
│   ├── inbox.tsx                      # Inbox layout with message list
│   ├── inbox._index.tsx               # Empty state when no message selected
│   ├── inbox.reply.$messageId.tsx     # Reply composer page
│   ├── api.v1.emails.inbox.ts         # GET inbox API
│   ├── api.v1.emails.thread.$messageId.ts  # GET thread API
│   ├── api.v1.emails.reply.ts         # POST reply API
│   └── api.v1.emails.status.ts        # POST status API
├── components/
│   ├── reply-composer.tsx             # Main reply UI component
│   ├── email-editor.tsx               # Maily editor wrapper
│   └── email-preview-iframe.tsx       # Safe HTML preview
└── lib/
    └── mock-email-messages.ts         # Mock data (replace with DB queries)
```

### Key Components

#### Inbox List (`/inbox`)
- Status filter tabs: Open | Needs Reply | Closed
- Message cards with:
  - Status indicator (color-coded)
  - Sender name and email
  - Subject line
  - Body preview (truncated)
  - Forwarded-from badge (if applicable)
  - Timestamp

#### Reply Composer (`/inbox/reply/:id`)
- Header section:
  - From (fixed: your sending address)
  - To (recipient email)
  - Subject (editable, pre-filled with Re:)
  - Include quoted thread checkbox
- Quick action buttons: Close | Spam | In Progress
- Maily visual editor with signature template
- Collapsible conversation history
- Threading headers debug panel
- Send button with loading state

---

## 9. ProtonMail Integration

### Setup Steps

1. **Create Resend Inbound Address**
   - In Resend dashboard, add inbound domain: `mail.gostudio.ai`
   - Create inbound address: `support-inbound@mail.gostudio.ai`
   - Configure webhook URL: `https://your-api.com/webhooks/resend/inbound`

2. **Configure ProtonMail Forwarding**
   - Login to ProtonMail → Settings → Filters
   - Create new filter:
     ```
     Name: Forward to Admin Panel
     Conditions: 
       - All incoming messages
       - OR specific: From contains "@" (customer domains)
     Actions:
       - Forward to: support-inbound@mail.gostudio.ai
       - Keep a copy (so you still see it in ProtonMail)
     ```

3. **Update Webhook Handler**
   ```typescript
   // In your existing Resend webhook handler
   app.post('/webhooks/resend/inbound', async (req, res) => {
     const payload = req.body;
     
     // 1. Save to database
     const message = await db.insert(emailMessages).values({
       direction: 'inbound',
       user_email: payload.from,
       subject: payload.subject,
       body_html: payload.html,
       body_text: payload.text,
       inbox_status: 'needs_reply',
       received_at: new Date(),
       raw_payload: payload,
       metadata: {
         forwarded_from: extractForwardedFrom(payload),
       },
       // ... other fields
     });
     
     // 2. Auto-pause ALL active campaigns for this person, not just the one
     //    tied to the campaign_recipient_id on the inbound message. A person
     //    can have multiple email_campaign_recipients rows (one per campaign,
     //    unique on campaign_id+user_id) — every active one must be stopped
     //    when they reply to any of them.
     const activeRecipients = await db.query.emailCampaignRecipients.findMany({
       where: and(
         eq(emailCampaignRecipients.user_email, payload.from),
         eq(emailCampaignRecipients.is_sequence_active, true),
       ),
     });

     if (activeRecipients.length > 0) {
       await db.update(emailCampaignRecipients)
         .set({
           is_sequence_active: false,
           automation_stopped_at: new Date(),
           automation_stop_reason: 'replied',
         })
         .where(and(
           eq(emailCampaignRecipients.user_id, activeRecipients[0].user_id),
           eq(emailCampaignRecipients.is_sequence_active, true),
         ));

       // 3. Notify Slack (optional)
       await notifySlack(
         `🛑 ${activeRecipients.length} campaign(s) paused: ${payload.from} replied. View in admin panel.`
       );
     }
     
     res.status(200).json({ received: true });
   });
   ```

---

## 10. Migration Guide

### For Your Developer

The current implementation uses **mock data** in `apps/web/app/lib/mock-email-messages.ts`. To migrate to production:

#### Step 1: Replace Mock Data Functions

| Mock Function | Replace With |
|---------------|--------------|
| `getInboundMessages()` | `SELECT * FROM email_messages WHERE direction = 'inbound' ORDER BY created_at DESC` |
| `getEmailMessageById(id)` | `SELECT * FROM email_messages WHERE id = $1` |
| `getEmailThread(messageId)` | `SELECT * FROM email_messages WHERE campaign_recipient_id = $1 ORDER BY created_at` |
| `getRecipientById(id)` | `SELECT * FROM email_campaign_recipients WHERE id = $1` |
| `updateInboxStatus(id, status)` | `UPDATE email_messages SET inbox_status = $2 WHERE id = $1` |
| `saveSentReply(data)` | `INSERT INTO email_messages (...) VALUES (...)` |

#### Step 2: Move API Routes

Copy these files to your backend and adapt:
- `api.v1.emails.inbox.ts` → Your API framework
- `api.v1.emails.thread.$messageId.ts` → Your API framework
- `api.v1.emails.reply.ts` → Your API framework (add actual Resend call)
- `api.v1.emails.status.ts` → Your API framework

#### Step 3: Implement Resend Send

In `api.v1.emails.reply.ts`, replace the mock send with:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: 'Kanika from GoStudio.AI <kanika@email.gostudio.ai>',
  to: threadingHeaders.to,
  subject: threadingHeaders.subject,
  html: fullHtmlWithQuotedThread,
  headers: {
    'In-Reply-To': threadingHeaders.inReplyTo,
    'References': threadingHeaders.references,
  },
});

// Save sent message with Resend's message ID
// Requires the manual_reply message_type migration — see Section 5.
await db.insert(emailMessages).values({
  direction: 'outbound',
  message_type: 'manual_reply',
  sequence_step: null,
  // ... other fields
  raw_payload: {
    message_id: result.id,
    headers: {
      'message-id': result.id,
      'in-reply-to': threadingHeaders.inReplyTo,
      'references': threadingHeaders.references,
    },
  },
});
```

#### Step 4: Update Frontend API Base URL

In production, update `httpPost` calls to point to your actual API:
```typescript
// From
httpPost('/api/v1/emails/reply', data)

// To
httpPost('https://api.gostudio.ai/v1/emails/reply', data)
```

---

## 11. Trade-offs & Decisions

### Decision 1: Route All Email Through Resend

**Chosen:** Forward ProtonMail → Resend  
**Alternative Rejected:** Sync ProtonMail via IMAP/Bridge

| Factor | Resend Forwarding | ProtonMail Sync |
|--------|-------------------|-----------------|
| Single source of truth | ✅ Yes | ⚠️ Delayed |
| Real-time | ✅ Webhook instant | ❌ Polling delay |
| Complexity | Low | High (Bridge setup) |
| Keep ProtonMail UI | ✅ Yes (with copy) | ✅ Yes |
| Threading support | ✅ Full control | ⚠️ Complex |

**Rationale:** Forwarding is simpler, real-time, and gives full control over threading headers.

### Decision 2: Visual Editor vs Plain Text

**Chosen:** Maily visual editor  
**Alternative Rejected:** Plain textarea

| Factor | Visual Editor | Plain Text |
|--------|---------------|------------|
| Rich formatting | ✅ Full HTML | ❌ None |
| Consistent branding | ✅ Signatures, styling | ❌ Manual |
| Learning curve | Medium | None |
| Mobile email rendering | ✅ Optimized | ⚠️ Varies |

**Rationale:** Marketing team needs professional-looking emails with consistent branding.

### Decision 3: Include Quoted Thread by Default

**Chosen:** Checkbox to include, default ON  
**Alternative:** Never include / Always include

**Rationale:** Most professional email replies include context. Making it optional handles edge cases (very long threads, sensitive content).

### Decision 4: Inbox Status Model

**Chosen:** 5 statuses: needs_reply, in_progress, replied, closed, spam  
**Alternative:** Simpler: open/closed

**Rationale:** Team needs visibility into work in progress. "In progress" prevents duplicate work. "Spam" helps with filtering.

### Decision 5: Authentication

**Chosen:** Simple Bearer token for MVP  
**Future:** Integrate with main app auth (JWT, session)

**Rationale:** Quick to implement for internal tool. Production should use proper auth.

---

## 12. Security Considerations

### Current Implementation (MVP)

| Concern | Current State | Production Recommendation |
|---------|---------------|---------------------------|
| API Auth | Bearer token in env | Integrate with main auth system |
| Token Storage | `.env` file | Secrets manager (AWS SSM, etc.) |
| CORS | Not configured | Restrict to admin domain |
| Rate Limiting | None | Add rate limits |
| Input Validation | Zod schemas | Keep Zod, add sanitization |
| HTML Injection | iframe sandbox | Keep sandbox, add CSP |

### Recommendations for Production

1. **Integrate with existing auth** - Use your app's JWT/session auth
2. **Add audit logging** - Track who sent what reply
3. **Restrict access** - Only admin users should access /inbox
4. **Sanitize HTML** - When rendering user-submitted HTML in quoted replies
5. **Rate limit sends** - Prevent accidental spam

---

## 13. Testing Checklist

### Manual Testing

- [ ] **Inbox loads** - `/inbox` shows list of inbound messages
- [ ] **Status filtering** - Tabs filter correctly (Open, Needs Reply, Closed)
- [ ] **Message selection** - Clicking message opens reply composer
- [ ] **Reply pre-fill** - Subject has "Re:", greeting has recipient name
- [ ] **Editor works** - Can type, format, add links
- [ ] **Thread view** - Can expand and view conversation history
- [ ] **Quick actions** - Close, Spam, In Progress buttons update status
- [ ] **Send reply** - Email sends, status updates to "replied"
- [ ] **Threading works** - Sent email appears in same thread in Gmail

### Integration Testing

- [ ] **Resend webhook** - Inbound emails create records in DB
- [ ] **Campaign pause** - Replying customer's campaign auto-pauses
- [ ] **Headers correct** - Sent emails have proper In-Reply-To/References

### Email Client Testing

Test sent replies in:
- [ ] Gmail (web)
- [ ] Gmail (mobile)
- [ ] Apple Mail (Mac)
- [ ] Apple Mail (iOS)
- [ ] Outlook (web)
- [ ] Outlook (desktop)

Verify:
- Reply appears in same thread
- Quoted content renders correctly
- Links work
- Images load

---

## 14. Future Enhancements

### Phase 2: Enhanced Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Search | Search inbox by sender, subject, content | High |
| Bulk actions | Close multiple, mark multiple as spam | Medium |
| Canned responses | Save and reuse common replies | Medium |
| Assign to team member | Multi-user support | Medium |
| Response time tracking | SLA metrics | Low |

### Phase 3: Automation

| Feature | Description | Priority |
|---------|-------------|----------|
| Auto-categorize | Use AI to tag message type | Medium |
| Smart reply suggestions | AI-generated reply drafts | Medium |
| Auto-close resolved | If customer says "thanks", auto-close | Low |
| Sentiment analysis | Flag angry customers | Low |

### Phase 4: Analytics

| Feature | Description | Priority |
|---------|-------------|----------|
| Response time dashboard | Average time to reply | Medium |
| Volume trends | Messages per day/week | Medium |
| Campaign correlation | Link support volume to campaigns | Low |

---

## Appendix A: File Manifest

Files created/modified in this implementation:

```
apps/web/app/
├── lib/
│   ├── mock-email-messages.ts    # NEW - Mock data + helpers
│   ├── mock-templates.ts         # MODIFIED - Added CRUD functions
│   ├── api-auth.ts               # NEW - Bearer token validation
│   └── http.ts                   # MODIFIED - Added auth header
├── routes/
│   ├── inbox.tsx                 # NEW - Inbox layout
│   ├── inbox._index.tsx          # NEW - Empty state
│   ├── inbox.reply.$messageId.tsx # NEW - Reply page
│   ├── api.v1.emails.inbox.ts    # NEW - Inbox API
│   ├── api.v1.emails.thread.$messageId.ts # NEW - Thread API
│   ├── api.v1.emails.reply.ts    # NEW - Send reply API
│   ├── api.v1.emails.status.ts   # NEW - Update status API
│   ├── templates.tsx             # MODIFIED - Added Inbox link
│   ├── templates._index.tsx      # MODIFIED - Removed redirect
│   ├── templates.$templateId.tsx # MODIFIED - Mock data
│   ├── playground.tsx            # MODIFIED - Removed redirect
│   ├── login.tsx                 # MODIFIED - Local redirect
│   └── auth.logout.ts            # MODIFIED - Simplified
├── components/
│   ├── reply-composer.tsx        # NEW - Reply UI
│   ├── view-email-html.tsx       # NEW - HTML viewer
│   ├── import-email-html.tsx     # NEW - HTML import
│   └── email-editor-sandbox.tsx  # MODIFIED - Added buttons
└── .env                          # MODIFIED - Added API token

docs/
└── TECHNICAL_HANDOFF_EMAIL_ADMIN_PANEL.md  # This document
```

---

## Appendix B: Environment Variables

```bash
# API Authentication (for admin panel)
API_ACCESS_TOKEN=your-secure-token-here
VITE_API_ACCESS_TOKEN=your-secure-token-here  # Same token, for frontend

# Resend (for sending emails)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Database (your existing config)
DATABASE_URL=postgresql://...

# Sender configuration
DEFAULT_FROM_EMAIL=kanika@email.gostudio.ai
DEFAULT_FROM_NAME=Kanika from GoStudio.AI
```

---

**End of Document**

*For questions or clarifications, refer to the conversation history or contact the development team.*
