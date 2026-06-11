import { Editor } from '@maily-to/core';
import type {
  FocusPosition,
  JSONContent,
  Editor as TiptapEditor,
} from '@tiptap/core';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '~/lib/classname';

type EmailEditorProps = {
  defaultContent?: JSONContent;
  setEditor: (editor: TiptapEditor) => void;
  autofocus?: FocusPosition;
};

export function EmailEditor(props: EmailEditorProps) {
  const { defaultContent, setEditor } = props;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="flex w-full items-center justify-center py-10">
          <Loader2Icon className="h-8 w-8 animate-spin stroke-[2.5] text-gray-500" />
        </div>
      )}

      <Editor.Root
        content={defaultContent}
        immediatelyRender={false}
        autofocus={false}
        onCreate={({ editor }) => {
          setIsLoading(false);
          setEditor(editor);
        }}
      >
        <Editor.Frame className={cn(isLoading && 'hidden')}>
          <Editor.Content />
        </Editor.Frame>
      </Editor.Root>
    </>
  );
}
