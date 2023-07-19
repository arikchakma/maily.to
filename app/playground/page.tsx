'use client';

import { useState } from 'react';

import { Editor, MailEditor } from '@/components/editor';
import { tiptapToHtml } from '@/components/editor/utils/email';
import { IFrame } from '@/app/iframe';

export default function PlaygroundPage() {
  const [mailEditor, setMailEditor] = useState<MailEditor>();
  const [emailHtml, setEmailHtml] = useState('');
  const defaultHtml = `<img src="favicon.svg" data-mailbox-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-mailbox-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-mailbox-component="button" mailboxcomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-mailbox-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`

  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(#000000_0.65px,transparent_0.65px),radial-gradient(#000000_0.65px,#ffffff_0.65px)] p-10 opacity-100 [background-position:0_0,13px_13px] [background-size:26px_26px]">
      <div className="grid grid-cols-2 items-stretch gap-4">
        <div className="">
          <Editor
            config={{
              hasMenuBar: true,
              wrapClassName: 'editor-wrap',
              contentClassName: 'editor-content',
              toolbarClassName: 'editor-toolbar',
              spellCheck: false,
            }}
            onMount={(editor) => {
              setMailEditor(editor);
            }}
            contentHtml={defaultHtml}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log(
                  tiptapToHtml(mailEditor?.getEditor()?.getJSON().content!)
                );
              }}
              className="mt-2 block w-full rounded-md bg-black p-2 text-white"
            >
              Get HTML
            </button>
            <button
              onClick={() => {
                setEmailHtml(
                  tiptapToHtml(mailEditor?.getEditor()?.getJSON().content!)
                );
              }}
              className="mt-2 block w-full rounded-md border-2 border-black bg-white p-2 text-black"
            >
              Preview HTML
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-4 flex h-[46px] items-center bg-white">
            <span className="text-xl font-semibold">&nbsp;</span>
          </div>
          <div className="flex-1 rounded-md border bg-white p-4">
            {!emailHtml && (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-semibold text-gray-400">
                  Preview HTML
                </span>
              </div>
            )}
            {emailHtml && (
              <IFrame className="h-full w-full" innerHTML={emailHtml} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
