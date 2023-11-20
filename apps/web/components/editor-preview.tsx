'use client';

import { Editor } from '@maily-to/core';
import { useState } from 'react';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { Asterisk } from 'lucide-react';
import { renderAsync } from '@maily-to/render';
import { Input } from './ui/input';
import { PreviewTextInfo } from './preview-text-info';

export function EditorPreview() {
  const [previewText, setPreviewText] = useState('');
  const [editor, setEditor] = useState<TiptapEditor>();

  const defaultHtml = `<img src="/brand/icon.svg" data-maily-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-maily-component="button" mailycomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`;

  async function render() {
    const content = editor?.getJSON();
    if (!content) {
      return;
    }

    const html = await renderAsync(content, {
      preview: previewText,
    });
    // eslint-disable-next-line no-console -- @TODO: Remove later
    console.log(html);
  }

  return (
    <div className="mt-20">
      <button
        className="rounded-md bg-black px-2 py-1 text-sm text-white"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- Because it's a button
        onClick={render}
        type="button"
      >
        <Asterisk className="inline-block mr-1" size={16} />
        Render
      </button>
      <div className="mb-8 mt-8">
        <div className="relative">
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
        onCreate={setEditor}
        onUpdate={setEditor}
      />
    </div>
  );
}
