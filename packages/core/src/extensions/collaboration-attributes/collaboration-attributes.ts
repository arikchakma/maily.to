import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import type { Doc, YMapEvent } from 'yjs';

export type CollaborationAttributesOptions = {
  document: Doc | null;
  field: string;
};

type CollaborationAttributesStorage = {
  unobserve: (() => void) | null;
};

declare module '@tiptap/core' {
  interface Storage {
    collaborationAttributes: CollaborationAttributesStorage;
  }
}

const COLLABORATION_ATTRIBUTES_META = 'collaborationAttributes';

function isSame(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function applyAttributes(editor: Editor, attributes: Map<string, unknown>) {
  const { tr } = editor.state;

  for (const [name, value] of attributes) {
    if (!isSame(tr.doc.attrs[name], value)) {
      tr.setDocAttribute(name, value);
    }
  }

  if (!tr.docChanged) {
    return;
  }

  editor.view.dispatch(
    tr
      .setMeta(COLLABORATION_ATTRIBUTES_META, true)
      .setMeta('addToHistory', false)
  );
}

// Yjs syncs only the document content, not `doc.attrs`. This extension keeps
// the document attributes, such as the theme and the text direction, in a
// shared Y.Map so that every collaborator sees the same values.
export const CollaborationAttributesExtension = Extension.create<
  CollaborationAttributesOptions,
  CollaborationAttributesStorage
>({
  name: 'collaborationAttributes',

  addOptions() {
    return {
      document: null,
      field: 'maily',
    };
  },

  addStorage() {
    return {
      unobserve: null,
    };
  },

  onCreate() {
    const { document, field } = this.options;
    if (!document) {
      return;
    }

    const map = document.getMap<unknown>(field);
    const observer = (event: YMapEvent<unknown>) => {
      if (event.transaction.origin === this.editor) {
        return;
      }

      applyAttributes(this.editor, new Map(map.entries()));
    };

    // A new collaborator does not write its defaults. Otherwise it can
    // overwrite the values that the other collaborators already set.
    applyAttributes(this.editor, new Map(map.entries()));
    map.observe(observer);
    this.storage.unobserve = () => map.unobserve(observer);
  },

  onTransaction({ transaction }) {
    const { document, field } = this.options;
    if (
      !document ||
      transaction.getMeta(COLLABORATION_ATTRIBUTES_META) ||
      transaction.before.attrs === transaction.doc.attrs
    ) {
      return;
    }

    const map = document.getMap<unknown>(field);
    const { attrs } = transaction.doc;

    document.transact(() => {
      for (const [name, value] of Object.entries(attrs)) {
        if (!isSame(map.get(name), value)) {
          map.set(name, value);
        }
      }
    }, this.editor);
  },

  onDestroy() {
    this.storage.unobserve?.();
    this.storage.unobserve = null;
  },
});
