import {
  EditorContent as TiptapEditorContent,
  useCurrentEditor,
} from '@tiptap/react';

export function EditorContent() {
  const { editor } = useCurrentEditor();

  return <TiptapEditorContent data-mly-editor-content="" editor={editor} />;
}
