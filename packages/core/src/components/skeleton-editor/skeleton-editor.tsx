import { buildDocFromVariableText } from '@maily-to/shared';
import type { Editor, EditorOptions } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';

import { useEditorVariables } from '~/hooks/use-editor-variables';
import { useSkeletonEditor } from '~/hooks/use-skeleton-editor';
import { cn } from '~/utils/classname';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

type SkeletonEditorProps = {
  content: string;
  onContentChange?: (content: string) => void;
  onEnter?: () => void;
  editorRef: React.RefObject<Editor | null>;
  placeholder?: string;
  autofocus?: EditorOptions['autofocus'];
  className?: string;
};

export function SkeletonEditor(props: SkeletonEditorProps) {
  const {
    content,
    onEnter,
    editorRef,
    placeholder,
    onContentChange,
    autofocus = 'end',
    className,
  } = props;

  const variables = useEditorVariables();

  const editor = useSkeletonEditor({
    variables,
    content: content ? buildDocFromVariableText(content) : '',
    placeholder: placeholder,
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => {
      editorRef.current = editor;
      onContentChange?.(editor.getText());
    },
    editorProps: {
      handleKeyDown: (_, event) => {
        if (event.key === 'Enter') {
          const popover = document.getElementById(
            VARIABLE_SUGGESTION_POPOVER_ID
          );
          if (popover) {
            return false;
          }

          event.preventDefault();
          onEnter?.();
          return true;
        }
      },
    },
    autofocus,
  });

  return (
    <div
      id="mly-skeleton-editor"
      className={cn(
        'mly:hide-scrollbar mly:overflow-x-scroll mly:px-1.5 mly:pr-2.5',
        className
      )}
    >
      <EditorContent
        className="mly:w-46 mly:[&>div]:focus:outline-none"
        editor={editor}
      />
    </div>
  );
}
