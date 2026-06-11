import { useMutation, useQuery } from '@tanstack/react-query';
import type { Editor, FocusPosition } from '@tiptap/core';
import { AsteriskIcon, Loader2Icon, LogInIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { Icons } from '~/components/icons';
import defaultEmailJSON from '~/lib/default-editor-json.json';
import { FetchError, httpPost } from '~/lib/http';

import {
  ApiKeyConfigDialog,
  apiKeyQueryOptions,
} from './api-key-config-dialog';
import { Container } from './container';
import { CopyEmailHtml } from './copy-email-html';
import { EmailEditor } from './email-editor';
import { PreviewEmailDialog } from './preview-email-dialog';
import { PreviewTextInfo } from './preview-text-info';
import { Input } from './ui/input';
import { Label } from './ui/label';

type EmailEditorSandboxProps = {
  autofocus?: FocusPosition;
};

export function EmailEditorSandbox(props: EmailEditorSandboxProps) {
  const { autofocus } = props;

  const { data: apiKeyConfig } = useQuery(apiKeyQueryOptions());

  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [showReplyTo, setShowReplyTo] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);

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
      <header className="py-5">
        <Container className="flex items-center justify-between">
          <Link className="text-xl font-semibold tracking-tight" to="/">
            maily.to
          </Link>

          <a
            className="text-zinc-300 transition-colors hover:text-black"
            href="https://github.com/arikchakma/maily.to"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icons.github className="size-6" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </a>
        </Container>
      </header>

      <Container className="mb-6 border-b border-zinc-200 py-6">
        <p className="text-lg text-balance">
          You can create an account to save email templates as well. It&apos;s
          free and easy to use.
        </p>
        <a
          className="mt-4 inline-flex items-center gap-1.5 border border-black bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
          href="/login"
        >
          <LogInIcon className="size-4" aria-hidden="true" />
          Login / Register
        </a>
      </Container>

      <Container className="mb-5 flex items-center gap-1.5">
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
          className="flex items-center border border-black bg-white px-2 py-1 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
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
      </Container>

      <Container>
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
                aria-label="Remove reply-to"
                className="flex h-10 shrink-0 items-center bg-transparent px-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={() => {
                  setReplyTo('');
                  setShowReplyTo(false);
                }}
              >
                <XIcon className="inline-block size-4" aria-hidden="true" />
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
          <span className="absolute top-0 right-0 flex h-full items-center">
            <PreviewTextInfo />
          </span>
        </div>
      </Container>

      <EmailEditor
        defaultContent={defaultEmailJSON}
        setEditor={setEditor}
        autofocus={autofocus}
      />
    </>
  );
}
