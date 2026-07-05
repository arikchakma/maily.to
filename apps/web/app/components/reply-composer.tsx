import { useMutation } from '@tanstack/react-query';
import type { Editor } from '@tiptap/core';
import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import { toast } from 'sonner';
import {
  SendIcon,
  Loader2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MailIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '~/lib/classname';
import { httpPost } from '~/lib/http';
import { EmailEditor } from './email-editor';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { EmailPreviewIFrame } from './email-preview-iframe';
import type {
  EmailMessage,
  EmailRecipient,
  InboxStatus,
} from '~/lib/mock-email-messages';
import { formatEmailDate } from '~/lib/mock-email-messages';

type ReplyContext = {
  inReplyTo: string;
  references: string;
  subject: string;
  to: string;
  toName: string | null;
  fromEmail: string;
  fromName: string;
};

type ReplyComposerProps = {
  messageId: number;
  replyContext: ReplyContext;
  thread: EmailMessage[];
  recipient: EmailRecipient | null | undefined;
  currentStatus?: InboxStatus;
};

type SendReplyResponse = {
  success: boolean;
  message: string;
  sentMessage: EmailMessage;
  resendPayload: {
    from: string;
    to: string;
    subject: string;
    headers: {
      'In-Reply-To': string;
      'References': string;
    };
  };
};

// Default signature template
const getDefaultContent = (recipientName: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `Hi ${recipientName},`,
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Best regards,',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'Kanika',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Founder, ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://gostudio.ai',
                target: '_blank',
              },
            },
          ],
          text: 'GoStudio.ai',
        },
      ],
    },
  ],
});

export function ReplyComposer(props: ReplyComposerProps) {
  const { messageId, replyContext, thread, recipient, currentStatus } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [subject, setSubject] = useState(replyContext.subject);
  const [includeQuotedThread, setIncludeQuotedThread] = useState(true);
  const [showThread, setShowThread] = useState(false);

  const { mutateAsync: sendReply, isPending: isSending } = useMutation({
    mutationFn: async () => {
      const json = editor?.getJSON();
      if (!json) {
        throw new Error('No content to send');
      }

      // Get HTML from the preview endpoint
      const previewResponse = await httpPost<{ html: string }>(
        '/api/v1/emails/preview',
        {
          content: JSON.stringify(json),
          previewText: '',
        }
      );

      // Send the reply
      return httpPost<SendReplyResponse>('/api/v1/emails/reply', {
        replyToMessageId: messageId,
        subject,
        htmlContent: previewResponse.html,
        includeQuotedThread,
      });
    },
    onSuccess: (data) => {
      console.log('Reply sent:', data);
      // Update status to replied
      updateStatus('replied');
      toast.success('Reply sent successfully!');
      navigate('/inbox');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reply');
    },
  });

  const { mutateAsync: updateStatusMutation, isPending: isUpdatingStatus } = useMutation({
    mutationFn: async (status: InboxStatus) => {
      return httpPost('/api/v1/emails/status', {
        messageId,
        status,
      });
    },
    onSuccess: () => {
      revalidator.revalidate();
    },
  });

  const updateStatus = async (status: InboxStatus) => {
    try {
      await updateStatusMutation(status);
      toast.success(`Marked as ${status.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Get the original inbound message (the one we're replying to)
  const inboundMessage = thread.find((m) => m.id === messageId);
  const recipientName = recipient?.first_name || 'there';

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Email headers */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-sm text-gray-500">From:</span>
              <span className="text-sm font-medium">
                {replyContext.fromName} &lt;{replyContext.fromEmail}&gt;
              </span>
            </Label>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateStatus('closed')}
                disabled={isUpdatingStatus}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                title="Mark as closed (no reply needed)"
              >
                <CheckCircle2 className="size-3" />
                Close
              </button>
              <button
                onClick={() => updateStatus('spam')}
                disabled={isUpdatingStatus}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                title="Mark as spam"
              >
                <XCircle className="size-3" />
                Spam
              </button>
              <button
                onClick={() => updateStatus('in_progress')}
                disabled={isUpdatingStatus}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                title="Mark as in progress"
              >
                <Clock className="size-3" />
                In Progress
              </button>
            </div>
          </div>

          <Label className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-sm text-gray-500">To:</span>
            <span className="text-sm">
              {replyContext.toName
                ? `${replyContext.toName} <${replyContext.to}>`
                : replyContext.to}
            </span>
          </Label>

          <Label className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-sm text-gray-500">Subject:</span>
            <Input
              className="h-8 flex-1 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Label>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={includeQuotedThread}
                onChange={(e) => setIncludeQuotedThread(e.target.checked)}
                className="rounded border-gray-300"
              />
              Include conversation history
            </label>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="mx-auto max-w-[700px] px-6 py-6">
          {/* Maily Editor */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <EmailEditor
              defaultContent={JSON.stringify(getDefaultContent(recipientName))}
              setEditor={setEditor}
              autofocus="start"
            />
          </div>

          {/* Previous conversation (collapsible) */}
          <div className="mt-6">
            <button
              onClick={() => setShowThread(!showThread)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <MailIcon className="size-4" />
                Conversation history ({thread.length} message
                {thread.length !== 1 ? 's' : ''})
              </span>
              {showThread ? (
                <ChevronUpIcon className="size-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="size-4 text-gray-500" />
              )}
            </button>

            {showThread && (
              <div className="mt-2 space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {thread.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'rounded-lg p-4',
                      msg.direction === 'inbound'
                        ? 'bg-blue-50 border-l-4 border-blue-400'
                        : 'bg-gray-50 border-l-4 border-gray-300'
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        {msg.direction === 'inbound' ? (
                          <>
                            {recipient?.first_name || msg.user_email}{' '}
                            <span className="font-normal text-gray-500">
                              ({msg.user_email})
                            </span>
                          </>
                        ) : (
                          <>
                            You{' '}
                            <span className="font-normal text-gray-500">
                              (kanika@email.gostudio.ai)
                            </span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatEmailDate(msg.created_at)}
                      </span>
                    </div>
                    <div className="text-sm">
                      {msg.body_html ? (
                        <EmailPreviewIFrame
                          innerHTML={msg.body_html}
                          className="max-h-[300px] overflow-y-auto"
                          wrapperClassName="w-full"
                        />
                      ) : (
                        <p className="whitespace-pre-wrap text-gray-700">
                          {msg.body_text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Threading debug info */}
          <details className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-xs shadow-sm">
            <summary className="cursor-pointer font-medium text-gray-600">
              Email Threading Headers (for developers)
            </summary>
            <div className="mt-3 space-y-2 rounded bg-gray-50 p-3 font-mono text-gray-600">
              <p>
                <strong className="text-gray-700">In-Reply-To:</strong>
                <br />
                <span className="break-all">{replyContext.inReplyTo}</span>
              </p>
              <p>
                <strong className="text-gray-700">References:</strong>
                <br />
                <span className="break-all">{replyContext.references}</span>
              </p>
            </div>
            <p className="mt-2 text-gray-500">
              These headers ensure the reply appears in the same thread in
              Gmail, Apple Mail, and Outlook.
            </p>
          </details>
        </div>
      </div>

      {/* Send button footer */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="size-4 text-amber-500" />
            Reply will be sent from {replyContext.fromEmail}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/inbox')}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => sendReply()}
              disabled={isSending}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SendIcon className="size-4" />
              )}
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
