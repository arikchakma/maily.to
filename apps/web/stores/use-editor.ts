import { Editor, JSONContent } from '@tiptap/core';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

type EditorStrore = {
  editor?: Editor;
  setEditor: (editor: Editor | undefined) => void;
  json: JSONContent;
  setJson: (json: JSONContent) => void;
  previewText: string;
  setPreviewText: (previewText: string) => void;
};

export const useEditorStrore = createWithEqualityFn<EditorStrore>(
  (set) => ({
    editor: undefined,
    setEditor: (editor) => set(() => ({ editor })),
    json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World!',
            },
          ],
        },
      ],
    },
    setJson: (json) => set(() => ({ json })),
    previewText: '',
    setPreviewText: (previewText) => set(() => ({ previewText })),
  }),
  shallow
);
