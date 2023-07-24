'use client';

import React, { useEffect } from 'react';
import {
  EditorContent,
  Editor as TipTapEditor,
  useEditor,
} from '@tiptap/react';

import { EditorBubbleMenu } from '../editor/components/editor-bubble-menu';
import { LogoBubbleMenu } from '../editor/components/logo-bubble-menu';
import { SpacerBubbleMenu } from '../editor/components/spacer-bubble-menu';
import { TiptapExtensions } from '../editor/extensions';

import '../editor/editor.css';
import { AppEditorMenuBar } from './app-editor-menubar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { AppEmailPreviewDialog } from './app-email-preview-dialog';
import { AppGetHtmlButton } from './app-get-html-button';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export function AppEditor() {
  const [subject, setSubject] = React.useState('');
  const params = useSearchParams();
  const router = useRouter()
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose w-full`,
        spellCheck: 'true',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
    extensions: TiptapExtensions,
    content: `<p></p>`,
  });

  console.log(params.get('id'))

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor='subject'>Subject</Label>
          <Input
            id='subject'
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="w-full mt-2"
          />
        </div>
      </div>
      <div className="antialiased border mt-6 rounded-md overflow-hidden">
        <AppEditorMenuBar editor={editor} />
        <div className="bg-white p-4">
          <EditorBubbleMenu editor={editor} />
          <LogoBubbleMenu editor={editor} />
          <SpacerBubbleMenu editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-6">
        <div className="flex items-center gap-2">
          <AppEmailPreviewDialog editor={editor} />
          <AppGetHtmlButton editor={editor} />
        </div>

        <Button onClick={() => {
          router.replace(`/template?id=123`)
        }}>
          Save
        </Button>
      </div>
    </>
  );
}
