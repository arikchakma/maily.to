import type { FocusPosition, Editor as TiptapEditor } from '@tiptap/core';
import { Loader2Icon } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { cn } from '~/lib/classname';
import type { Database } from '~/types/database';

const Editor = lazy(() =>
  import('@maily-to/core').then((module) => ({
    default: module.Editor,
  }))
);

type EmailEditorProps = {
  defaultContent: Database['public']['Tables']['mails']['Row']['content'];
  setEditor: (editor: TiptapEditor) => void;
  autofocus?: FocusPosition;
};

export function EmailEditor(props: EmailEditorProps) {
  const { defaultContent, setEditor, autofocus } = props;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="flex w-full items-center justify-center py-10">
          <Loader2Icon className="h-8 w-8 animate-spin stroke-[2.5] text-gray-500" />
        </div>
      )}

      <Suspense>
        <Editor
          config={{
            hasMenuBar: false,
            wrapClassName: cn('editor-wrap', isLoading && 'hidden'),
            bodyClassName: '!mt-0 !border-0 !p-0',
            contentClassName: `editor-content mx-auto max-w-[calc(600px+80px)]! px-10! pb-10!`,
            toolbarClassName: 'flex-wrap !items-start',
            spellCheck: false,
            autofocus,
            immediatelyRender: false,
          }}
          contentJson={
            defaultContent ? JSON.parse(defaultContent as string) : null
          }
          onCreate={(editor) => {
            setIsLoading(false);
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
