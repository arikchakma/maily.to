import type { Editor as TiptapEditor } from '@tiptap/core';
import { Loader2Icon } from 'lucide-react';
import { lazy, Suspense } from 'react';
import type { Database } from '~/types/database';

const Editor = lazy(() =>
  import('@maily-to/core').then((module) => ({
    default: module.Editor,
  }))
);

type EmailEditorProps = {
  defaultContent: Database['public']['Tables']['mails']['Row']['content'];

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
  const { defaultContent, setEditor } = props;

  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loader2Icon className="mx-auto h-6 w-6 animate-spin" />
          </div>
        }
      >
        <Editor
          config={{
            hasMenuBar: false,
            wrapClassName: 'editor-wrap',
            bodyClassName: '!mt-0 !border-0 !p-0',
            contentClassName: `editor-content mx-auto max-w-[calc(600px+80px)]! px-10! pb-10!`,
            toolbarClassName: 'flex-wrap !items-start',
            spellCheck: false,
            autofocus: 'end',
            immediatelyRender: false,
          }}
          contentJson={
            defaultContent ? JSON.parse(defaultContent as string) : null
          }
          onCreate={(editor) => {
            setEditor(editor);
          }}
          onUpdate={(editor) => {
            setEditor(editor);
          }}
        />
      </Suspense>
    </>
  );
}
