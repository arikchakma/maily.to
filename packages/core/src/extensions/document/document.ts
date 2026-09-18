import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { Document as TiptapDocument } from '@tiptap/extension-document';

const DOCUMENT_VERSION = 2;

export const Document = TiptapDocument.extend({
  content: MAILY_NODE_TYPES.BODY,

  addAttributes() {
    return {
      ...this.parent?.(),
      version: {
        default: DOCUMENT_VERSION,
      },
    };
  },
});
