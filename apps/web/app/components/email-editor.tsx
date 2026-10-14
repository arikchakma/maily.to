import { Editor, Toolbar } from '@maily-to/core';
import {
  ImageUploadExtension,
  LinkCardExtension,
  ThemeExtension,
  VariableExtension,
} from '@maily-to/core/extensions';
import { BASIC_NODE_THEME } from '@maily-to/shared';
import type {
  FocusPosition,
  JSONContent,
  Editor as TiptapEditor,
} from '@tiptap/core';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { Container } from '~/components/container';
import { cn } from '~/lib/classname';

type EmailEditorProps = {
  defaultContent?: JSONContent;
  setEditor: (editor: TiptapEditor) => void;
  autofocus?: FocusPosition;
};

const EDITOR_EXTENSIONS = [
  VariableExtension,
  ImageUploadExtension.configure({
    onImageUpload: (file) => {
      return Promise.resolve(URL.createObjectURL(file));
    },
  }),
  LinkCardExtension,
  ThemeExtension.configure({ theme: BASIC_NODE_THEME }),
];

export function EmailEditor(props: EmailEditorProps) {
  const { defaultContent, setEditor, autofocus = false } = props;

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
        extensions={EDITOR_EXTENSIONS}
        immediatelyRender={false}
        autofocus={autofocus}
        onCreate={({ editor }) => {
          setIsLoading(false);
          setEditor(editor);
        }}
      >
        <Container>
          <Toolbar.Root className={cn(isLoading && 'hidden')}>
            <Toolbar.CommonActions />
          </Toolbar.Root>
        </Container>

        <Editor.Frame className={cn(isLoading && 'hidden')}>
          <Editor.Content />
          <Editor.BubbleMenus />
          <Editor.DragContextHandle />
        </Editor.Frame>
      </Editor.Root>
    </>
  );
}
