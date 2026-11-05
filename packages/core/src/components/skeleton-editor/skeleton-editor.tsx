import { buildDocFromVariableText } from '@maily-to/shared';
import type { Editor, EditorOptions } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import type { RefObject } from 'react';

import { useEditorVariables } from '~/hooks/use-editor-variables';
import { useSkeletonEditor } from '~/hooks/use-skeleton-editor';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

export type SkeletonEditorProps = {
  autofocus?: EditorOptions['autofocus'];
  content: string;
  editorRef: RefObject<Editor | null>;
  onContentChange?: (content: string) => void;
  onEnter?: () => void;
  placeholder?: string;
};

export function SkeletonEditor(props: SkeletonEditorProps) {
  const {
    autofocus = 'end',
    content,
    editorRef,
    onContentChange,
    onEnter,
    placeholder,
  } = props;

  const variables = useEditorVariables();

  const editor = useSkeletonEditor({
    autofocus,
    content: content ? buildDocFromVariableText(content) : '',
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key !== 'Enter') {
          return false;
        }

        if (document.getElementById(VARIABLE_SUGGESTION_POPOVER_ID)) {
          return false;
        }

        event.preventDefault();
        onEnter?.();

        return true;
      },
    },
    onCreate: ({ editor: instance }) => {
      editorRef.current = instance;
    },
    onUpdate: ({ editor: instance }) => {
      editorRef.current = instance;
      onContentChange?.(instance.getText());
    },
    placeholder,
    variables,
  });

  return (
    <div data-mly-skeleton-editor="">
      <EditorContent editor={editor} />
    </div>
  );
}
