'use client';

import { useState } from 'react';
import type { EditorProps } from '@maily-to/core';
import { Editor } from '@maily-to/core';
import { Loader2, X } from 'lucide-react';
import type { Editor as TiptapEditor, JSONContent } from '@tiptap/core';
import { Input } from './ui/input';
import { PreviewTextInfo } from './preview-text-info';
import { Label } from './ui/label';
import { cn } from '@/utils/classname';
import { useEditorContext } from '@/stores/editor-store';

interface EditorPreviewProps {
  className?: string;
  content?: JSONContent;
  config?: Partial<EditorProps['config']>;
}

export function EditorPreview(props: EditorPreviewProps) {
  const { className, content: defaultContent, config: defaultConfig } = props;
  const {
    editor,
    previewText,
    setPreviewText,
    setEditor,
    setJson,
    subject,
    setSubject,
    from,
    setFrom,
    replyTo,
    setReplyTo,
    to,
    setTo,
    apiKey,
  } = useEditorContext((s) => s);

  const [showReplyTo, setShowReplyTo] = useState(false);

  const defaultHtml = `<img src="https://maily.to/brand/logo.png" data-maily-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-maily-component="button" mailycomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`;

  return (
    <div className={cn('mt-8', className)}>
      <Label className="flex items-center font-normal">
        <span className="w-20 shrink-0 font-normal text-gray-600 after:ml-0.5 after:text-red-400 after:content-['*']">
          Subject
        </span>
        <Input
          className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          placeholder="Email Subject"
          type="text"
          value={subject}
        />
      </Label>
      <div className="flex items-center gap-1.5">
        <Label className="flex grow items-center font-normal">
          <span className="w-20 shrink-0 font-normal text-gray-600">From</span>
          <Input
            className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={!apiKey}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
            placeholder="Arik Chakma <hello@maily.to>"
            type="text"
            value={from}
          />
        </Label>

        {showReplyTo ? null : (
          <button
            className="inline-block h-full shrink-0 bg-transparent px-1 text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            disabled={!apiKey}
            onClick={() => {
              setShowReplyTo(true);
            }}
            type="button"
          >
            Reply-To
          </button>
        )}
      </div>
      {showReplyTo ? (
        <Label className="flex items-center font-normal">
          <span className="w-20 shrink-0 font-normal text-gray-600">
            Reply-To
          </span>
          <div className="align-content-stretch flex grow items-center">
            <Input
              className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={!apiKey}
              onChange={(e) => {
                setReplyTo(e.target.value);
              }}
              placeholder="noreply@maily.to"
              type="text"
              value={replyTo}
            />
            <button
              className="flex h-10 shrink-0 items-center bg-transparent px-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                setReplyTo('');
                setShowReplyTo(false);
              }}
              type="button"
            >
              <X className="inline-block" size={16} />
            </button>
          </div>
        </Label>
      ) : null}
      <Label className="flex items-center font-normal">
        <span className="w-20 shrink-0 font-normal text-gray-600">To</span>
        <Input
          className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={!apiKey}
          onChange={(e) => {
            setTo(e.target.value);
          }}
          placeholder="Email Recipient(s)"
          type="text"
          value={to}
        />
      </Label>

      <div className="relative my-6">
        <Input
          className="h-auto rounded-none border-x-0 border-gray-300 px-0 py-2.5 pr-5 text-base focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => {
            setPreviewText(e.target.value);
          }}
          placeholder="Preview Text"
          type="text"
          value={previewText}
        />
        <span className="absolute right-0 top-0 flex h-full items-center">
          <PreviewTextInfo />
        </span>
      </div>
      <div>
        {!editor ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : null}
        <Editor
          config={{
            hasMenuBar: false,
            wrapClassName: 'editor-wrap',
            bodyClassName: '!mt-0 !border-0 !p-0',
            contentClassName: 'editor-content',
            toolbarClassName: 'flex-wrap !items-start',
            spellCheck: false,
            autofocus: false,
            ...defaultConfig,
          }}
          contentHtml={defaultHtml}
          contentJson={defaultContent}
          lang="en"
          onCreate={(e) => {
            setEditor(e as unknown as TiptapEditor);
            setJson(e?.getJSON() || {});
          }}
          onUpdate={(e) => {
            setEditor(e as unknown as TiptapEditor);
            setJson(e?.getJSON() || {});
          }}
        />
      </div>
    </div>
  );
}
