import { buildDocFromVariableText } from '@maily-to/shared';
import type { Editor, EditorOptions } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import type { RefObject } from 'react';

import { useEditorVariables } from '~/hooks/use-editor-variables';
import {
  getVariableOnlyContent,
  useVariableOnlyEditor,
} from '~/hooks/use-variable-only-editor';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

export type VariableOnlyEditorProps = {
  autofocus?: EditorOptions['autofocus'];
  content: string;
  editorRef: RefObject<Editor | null>;
  onContentChange?: (content: string) => void;
  onEnter?: () => void;
  placeholder?: string;
};

export function VariableOnlyEditor(props: VariableOnlyEditorProps) {
  const {
    autofocus = 'end',
    content,
    editorRef,
    onContentChange,
    onEnter,
    placeholder,
  } = props;

  const variables = useEditorVariables();

  const editor = useVariableOnlyEditor({
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
      onContentChange?.(getVariableOnlyContent(instance));
    },
    placeholder,
    variables,
  });

  return (
    <div data-mly-variable-only-editor="">
      <EditorContent editor={editor} />
    </div>
  );
}
