import { Document as TiptapDocument } from '@tiptap/extension-document';

export const DOCUMENT_VERSION = 2;

export const Document = TiptapDocument.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      version: {
        default: DOCUMENT_VERSION,
      },
    };
  },
});
