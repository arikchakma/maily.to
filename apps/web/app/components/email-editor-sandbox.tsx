import { useMutation, useQuery } from '@tanstack/react-query';
import type { Editor, FocusPosition } from '@tiptap/core';
import {
  FileCogIcon,
  Loader2Icon,
  SaveIcon,
  XIcon,
  AsteriskIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import { toast } from 'sonner';
import { cn } from '~/lib/classname';
import { FetchError, httpPost } from '~/lib/http';
import type { Database } from '~/types/database';
import { CopyEmailHtml } from './copy-email-html';
import { DeleteEmailDialog } from './delete-email-dialog';
import { EmailEditor } from './email-editor';
import { PreviewEmailDialog } from './preview-email-dialog';
import { PreviewTextInfo } from './preview-text-info';
import { Input } from './ui/input';
import { Label } from './ui/label';
import defaultEmailJSON from '~/lib/default-editor-json.json';
import {
  ApiKeyConfigDialog,
  apiKeyQueryOptions,
} from './api-key-config-dialog';

type UpdateTemplateData = {
  title: string;
  previewText: string;
  content: string;
};

type SaveTemplateResponse = {
  template: Database['public']['Tables']['mails']['Row'];
};

type EmailEditorSandboxProps = {
  template?: Database['public']['Tables']['mails']['Row'];
  showSaveButton?: boolean;
  autofocus?: FocusPosition;
};

export function EmailEditorSandbox(props: EmailEditorSandboxProps) {
  const { template, showSaveButton = true, autofocus } = props;

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { data: apiKeyConfig } = useQuery(apiKeyQueryOptions());

  const [subject, setSubject] = useState(template?.title || '');
  const [previewText, setPreviewText] = useState(template?.preview_text || '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [showReplyTo, setShowReplyTo] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);

  const { mutateAsync: updateTemplate, isPending: isUpdateTemplatePending } =
    useMutation({
      mutationFn: (data: UpdateTemplateData) => {
        return httpPost(`/api/v1/templates/${template?.id}`, data);
      },
      onSettled: () => {
        revalidator.revalidate();
      },
    });

  const { mutateAsync: saveTemplate, isPending: isSaveTemplatePending } =
    useMutation({
      mutationFn: (data: UpdateTemplateData) => {
        return httpPost<SaveTemplateResponse>(`/api/v1/templates`, data);
      },
      onSuccess: (data) => {
        navigate(`/templates/${data.template.id}`);
      },
    });

  const { mutateAsync: sendTestEmail, isPending: isSendTestEmailPending } =
    useMutation({
      mutationFn: async () => {
        const json = editor?.getJSON();
        if (!json) {
          throw new FetchError(400, 'Editor content is empty');
        }

        return httpPost(`/api/v1/emails/send`, {
          subject,
          previewText,
          from,
          to,
          replyTo,
          content: JSON.stringify(json),
        });
      },
    });

  return (
    <>
      <div className="max-w-[calc(600px+80px)]! mx-auto mb-8 flex items-center justify-between gap-1.5 px-10 pt-5">
        <div className="flex items-center gap-1.5">
          <ApiKeyConfigDialog
            apiKey={apiKeyConfig?.apiKey}
            provider={apiKeyConfig?.provider}
          />
          <PreviewEmailDialog
            subject={subject}
            previewText={previewText}
            editor={editor}
          />
          <CopyEmailHtml previewText={previewText} editor={editor} />
          <button
            className="flex items-center rounded-md bg-white px-2 py-1 text-sm text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isSendTestEmailPending}
            onClick={() => {
              toast.promise(sendTestEmail(), {
                loading: 'Sending Test Email...',
                success: 'Test Email has been sent',
                error: (err) => err?.message || 'Failed to send test email',
              });
            }}
          >
            {isSendTestEmailPending ? (
              <Loader2Icon className="mr-1 inline-block size-4 animate-spin" />
            ) : (
              <AsteriskIcon className="mr-1 inline-block size-4" />
            )}
            Send Email
          </button>
        </div>

        {!template?.id && showSaveButton && (
          <button
            className={cn(
              'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7'
            )}
            disabled={isSaveTemplatePending}
            onClick={() => {
              const json = editor?.getJSON();

              const trimmedSubject = subject.trim();
              const trimmedPreviewText = previewText.trim();
              if (!trimmedSubject || !json) {
                toast.error('Subject, Preview Text and Content are required');
                return;
              }

              if (trimmedSubject.length < 3) {
                toast.error('Subject must be at least 3 characters');
                return;
              }

              toast.promise(
                saveTemplate({
                  title: trimmedSubject,
                  previewText: trimmedPreviewText,
                  content: JSON.stringify(json),
                }),
                {
                  loading: 'Saving Template...',
                  success: 'Template has been saved',
                  error: (err) => err?.message || 'Failed to save email',
                }
              );
            }}
          >
            {isSaveTemplatePending ? (
              <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
            ) : (
              <SaveIcon className="inline-block size-4 shrink-0 lg:mr-1" />
            )}
            <span className="hidden lg:inline-block">Save</span>
          </button>
        )}

        {template?.id && (
          <div className="flex items-center gap-1.5">
            <DeleteEmailDialog templateId={template.id} />
            <button
              className={cn(
                'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7'
              )}
              disabled={isUpdateTemplatePending}
              onClick={() => {
                const json = editor?.getJSON();

                const trimmedSubject = subject.trim();
                const trimmedPreviewText = previewText.trim();
                if (!trimmedSubject || !json) {
                  toast.error('Subject, Preview Text and Content are required');
                  return;
                }

                if (trimmedSubject.length < 3) {
                  toast.error('Subject must be at least 3 characters');
                  return;
                }

                toast.promise(
                  updateTemplate({
                    title: trimmedSubject,
                    previewText: trimmedPreviewText,
                    content: JSON.stringify(json),
                  }),
                  {
                    loading: 'Updating Template...',
                    success: 'Template has been updated',
                    error: (err) => err?.message || 'Failed to update email',
                  }
                );
              }}
            >
              {isUpdateTemplatePending ? (
                <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
              ) : (
                <FileCogIcon className="inline-block size-4 shrink-0 lg:mr-1" />
              )}
              <span className="hidden lg:inline-block">Update</span>
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[calc(600px+80px)]! mx-auto px-10">
        <Label className="flex items-center font-normal">
          <span className="w-20 shrink-0 font-normal text-gray-600 after:ml-0.5 after:text-red-400 after:content-['*']">
            Subject
          </span>
          <Input
            className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Email Subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </Label>
        <div className="flex items-center gap-1.5">
          <Label className="flex grow items-center font-normal">
            <span className="w-20 shrink-0 font-normal text-gray-600">
              From
            </span>
            <Input
              className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Arik Chakma <hello@maily.to>"
              type="text"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </Label>

          {!showReplyTo && (
            <button
              className="inline-block h-full shrink-0 bg-transparent px-1 text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              type="button"
              onClick={() => {
                setShowReplyTo(true);
              }}
            >
              Reply-To
            </button>
          )}
        </div>

        {showReplyTo && (
          <Label className="flex items-center font-normal">
            <span className="w-20 shrink-0 font-normal text-gray-600">
              Reply-To
            </span>
            <div className="align-content-stretch flex grow items-center">
              <Input
                className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="noreply@maily.to"
                type="text"
                value={replyTo}
                onChange={(event) => setReplyTo(event.target.value)}
              />
              <button
                className="flex h-10 shrink-0 items-center bg-transparent px-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={() => {
                  setReplyTo('');
                  setShowReplyTo(false);
                }}
              >
                <XIcon className="inline-block size-4" />
              </button>
            </div>
          </Label>
        )}

        <Label className="flex items-center font-normal">
          <span className="w-20 shrink-0 font-normal text-gray-600">To</span>
          <Input
            className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Email Recipient(s)"
            type="text"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </Label>

        <div className="relative my-6">
          <Input
            className="h-auto rounded-none border-x-0 border-gray-300 px-0 py-2.5 pr-5 text-base focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Preview Text"
            type="text"
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
          />
          <span className="absolute right-0 top-0 flex h-full items-center">
            <PreviewTextInfo />
          </span>
        </div>
      </div>

      <EmailEditor
        defaultContent={template?.content || JSON.stringify(defaultEmailJSON)}
        setEditor={setEditor}
        autofocus={autofocus}
      />
    </>
  );
}
