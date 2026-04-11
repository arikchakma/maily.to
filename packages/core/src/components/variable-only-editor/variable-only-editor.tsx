import { buildDocFromVariableText } from '@maily-to/shared';
import type { Editor, EditorOptions } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';

import { useEditorVariables } from '~/hooks/use-editor-variables';
import {
  getVariableOnlyContent,
  useVariableOnlyEditor,
} from '~/hooks/use-variable-only-editor';
import { cn } from '~/utils/classname';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

type VariableOnlyEditorProps = {
  content: string;
  onContentChange?: (content: string) => void;
  onEnter?: () => void;
  editorRef: React.RefObject<Editor | null>;
  placeholder?: string;
  autofocus?: EditorOptions['autofocus'];
  className?: string;
};

export function VariableOnlyEditor(props: VariableOnlyEditorProps) {
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

  const editor = useVariableOnlyEditor({
    variables,
    content: content ? buildDocFromVariableText(content) : '',
    placeholder: placeholder,
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => {
      editorRef.current = editor;
      // Only emit variable content, not any text that might be in progress
      const variableContent = getVariableOnlyContent(editor);
      onContentChange?.(variableContent);
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
