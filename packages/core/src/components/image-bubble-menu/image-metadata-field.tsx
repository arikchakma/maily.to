import type { Editor, EditorOptions } from '@tiptap/react';
import { useRef } from 'react';

import { SkeletonEditor } from '../skeleton-editor/skeleton-editor';

type ImageMetadataFieldProps = {
  label: string;
  content: string;
  onContentChange: (content: string) => void;
  placeholder: string;
  autofocus: EditorOptions['autofocus'];
};

export function ImageMetadataField(props: ImageMetadataFieldProps) {
  const { label, content, onContentChange, placeholder, autofocus } = props;

  const editorRef = useRef<Editor | null>(null);

  const focusEditor = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.commands.focus('end');
  };

  return (
    <div className="mly:flex mly:items-center mly:gap-1">
      <span
        role="label"
        className="mly:min-w-16 mly:pl-2 mly:text-sm mly:font-medium mly:text-gray-400"
        onClick={focusEditor}
        aria-label={label}
      >
        {label}
      </span>
      <SkeletonEditor
        placeholder={placeholder}
        editorRef={editorRef}
        content={content}
        autofocus={autofocus}
        onContentChange={onContentChange}
        className="mly:rounded-lg mly:bg-soft-gray"
      />
    </div>
  );
}
