'use client';

import { useAtom } from 'jotai';

import { editorAtom } from '@/lib/editor-atom';

import { Editor } from './editor';
import { EmailPreviewDialog } from './email-preview-dialog';
import { GetHtmlButton } from './get-html-button';

export function EditorPreview() {
  const [editor, setEditor] = useAtom(editorAtom);
  const defaultHtml = `<img src="/brand/icon.svg" data-mailbox-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-mailbox-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-mailbox-component="button" mailboxcomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-mailbox-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`;

  return (
    <>
      <div className="mt-3">
        <Editor
          config={{
            hasMenuBar: true,
            wrapClassName: 'editor-wrap',
            contentClassName: 'editor-content',
            toolbarClassName: 'flex-wrap !items-start',
            spellCheck: false,
          }}
          onMount={(editor) => setEditor(editor)}
          contentHtml={defaultHtml}
        />
      </div>

      {editor && (
        <div className="mb-8 mt-4 flex flex-col gap-2 md:flex-row">
          <GetHtmlButton editor={editor} />
          <EmailPreviewDialog editor={editor} />
        </div>
      )}
    </>
  );
}
