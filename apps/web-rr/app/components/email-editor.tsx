import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { XIcon } from 'lucide-react';
import { PreviewTextInfo } from './preview-text-info';
import type { Database } from '~/types/database';
import { Editor } from '@maily-to/core';
import type { Editor as TiptapEditor } from '@tiptap/core';

type EmailEditorProps = {
  template: Database['public']['Tables']['mails']['Row'];

  subject: string;
  setSubject: (subject: string) => void;
  from: string;
  setFrom: (from: string) => void;
  to: string;
  setTo: (to: string) => void;
  replyTo?: string;
  setReplyTo: (replyTo: string) => void;

  previewText: string;
  setPreviewText: (previewText: string) => void;

  setEditor: (editor: TiptapEditor) => void;
};

export function EmailEditor(props: EmailEditorProps) {
  const {
    template,
    subject,
    setSubject,
    from,
    setFrom,
    to,
    setTo,
    replyTo,
    setReplyTo,
    previewText,
    setPreviewText,
    setEditor,
  } = props;

  const [showReplyTo, setShowReplyTo] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[712px] p-5">
      <div>
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

      <Editor
        config={{
          hasMenuBar: false,
          wrapClassName: 'editor-wrap',
          bodyClassName: '!mt-0 !border-0 !p-0',
          contentClassName: 'editor-content',
          toolbarClassName: 'flex-wrap !items-start',
          spellCheck: false,
          autofocus: 'end',
          immediatelyRender: false,
        }}
        contentJson={JSON.parse(template?.content as any)}
        onCreate={(editor) => {
          setEditor(editor as any);
        }}
        onUpdate={(editor) => {
          setEditor(editor as any);
        }}
      />
    </div>
  );
}
