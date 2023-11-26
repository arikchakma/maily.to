'use client';

import { useState } from 'react';
import { Editor } from '@maily-to/core';
import { Asterisk, X } from 'lucide-react';
import { Input } from './ui/input';
import { PreviewTextInfo } from './preview-text-info';
import { PreviewEmail } from './preview-email';
import { Label } from './ui/label';
import { useEmailStrore } from '@/stores/use-email';
import { useEditorStrore } from '@/stores/use-editor';
import { SendTestEmail } from './send-test-email';

export function EditorPreview() {
  const { previewText, setPreviewText, setEditor, setJson } = useEditorStrore();
  const { subject, setSubject, from, setFrom, replyTo, setReplyTo, to, setTo } =
    useEmailStrore();

  const [showReplyTo, setShowReplyTo] = useState(false);

  const defaultHtml = `<img src="/brand/icon.svg" data-maily-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-maily-component="button" mailycomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`;

  return (
    <div className="mt-20">
      <div className="flex items-center gap-1.5 justify-end">
        <SendTestEmail />
        <PreviewEmail />
      </div>
      <div className="mb-8 mt-8">
        <Label className="flex items-center font-normal">
          <span className="w-20 font-normal text-gray-600 shrink-0">
            Subject
          </span>
          <Input
            type="text"
            className="border-none rounded-none font-normal h-auto py-2.5 focus-visible:ring-offset-0 focus-visible:ring-0"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
        </Label>
        <div className="flex items-center gap-1.5">
          <Label className="flex items-center font-normal grow">
            <span className="w-20 font-normal text-gray-600 shrink-0">
              From
            </span>
            <Input
              type="text"
              className="border-none rounded-none font-normal h-auto py-2.5 focus-visible:ring-offset-0 focus-visible:ring-0"
              placeholder="Arik Chakma <hello@maily.to>"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            />
          </Label>

          {showReplyTo ? null : (
            <button
              className="text-sm h-full inline-block bg-transparent px-1 text-gray-500 shrink-0 hover:text-gray-700"
              onClick={() => {
                setShowReplyTo(true);
              }}
            >
              Reply-To
            </button>
          )}
        </div>
        {showReplyTo ? (
          <Label className="flex items-center font-normal">
            <span className="w-20 font-normal text-gray-600 shrink-0">
              Reply-To
            </span>
            <div className="flex items-center grow align-content-stretch">
              <Input
                type="text"
                className="border-none rounded-none font-normal h-auto py-2.5 focus-visible:ring-offset-0 focus-visible:ring-0"
                placeholder="noreply@maily.to"
                value={replyTo}
                onChange={(e) => {
                  setReplyTo(e.target.value);
                }}
              />
              <button
                className="flex items-center h-10 bg-transparent px-1 text-gray-500 shrink-0 hover:text-gray-700"
                onClick={() => {
                  setReplyTo('');
                  setShowReplyTo(false);
                }}
              >
                <X className="inline-block" size={16} />
              </button>
            </div>
          </Label>
        ) : null}
        <Label className="flex items-center font-normal">
          <span className="w-20 font-normal text-gray-600 shrink-0">To</span>
          <Input
            type="text"
            className="border-none rounded-none font-normal h-auto py-2.5 focus-visible:ring-offset-0 focus-visible:ring-0"
            placeholder="Email Recipient(s)"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </Label>

        <div className="relative mt-6">
          <Input
            className="border-x-0 border-gray-300 focus-visible:border-gray-400 rounded-none text-base h-auto px-0 focus-visible:ring-offset-0 focus-visible:ring-0 pr-5 py-2.5"
            onChange={(e) => {
              setPreviewText(e.target.value);
            }}
            placeholder="Preview Text"
            type="text"
            value={previewText}
          />
          <span className="absolute right-0 top-0 flex items-center h-full">
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
        }}
        contentHtml={defaultHtml}
        onCreate={(e) => {
          setEditor(e);
          setJson(e?.getJSON() || {});
        }}
        onUpdate={(e) => {
          setEditor(e);
          setJson(e?.getJSON() || {});
        }}
      />
    </div>
  );
}
