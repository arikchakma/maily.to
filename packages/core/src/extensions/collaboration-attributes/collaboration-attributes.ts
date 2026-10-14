import { isMergeableObject } from '@maily-to/shared';
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

type Attributes = Record<string, unknown>;

const COLLABORATION_ATTRIBUTES_META = 'collaborationAttributes';

function getAttributePaths(
  attributes: Attributes,
  prefix = ''
): [string, unknown][] {
  return Object.entries(attributes).flatMap(([name, value]) => {
    return isMergeableObject(value)
      ? getAttributePaths(value, `${prefix}${name}.`)
      : [[`${prefix}${name}`, value]];
  });
}

function setAttributes(editor: Editor, changes: [string, unknown][]) {
  const attributes = structuredClone(editor.state.doc.attrs) as Attributes;

  for (const [path, value] of changes) {
    const names = path.split('.');
    const last = names.pop()!;
    let target = attributes;

    for (const name of names) {
      target[name] = isMergeableObject(target[name]) ? target[name] : {};
      target = target[name] as Attributes;
    }

    if (value === undefined) {
      delete target[last];
    } else {
      target[last] = value;
    }
  }

  const { tr } = editor.state;

  for (const [name, value] of Object.entries(attributes)) {
    if (JSON.stringify(tr.doc.attrs[name]) !== JSON.stringify(value)) {
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

      setAttributes(
        this.editor,
        [...event.keysChanged].map((path) => [path, map.get(path)])
      );
    };

    setAttributes(this.editor, [...map.entries()]);
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
    const before = new Map(getAttributePaths(transaction.before.attrs));
    const after = new Map(getAttributePaths(transaction.doc.attrs));

    document.transact(() => {
      for (const [path, value] of after) {
        if (before.get(path) !== value) {
          map.set(path, value);
        }
      }

      for (const path of before.keys()) {
        if (!after.has(path)) {
          map.delete(path);
        }
      }
    }, this.editor);
  },

  onDestroy() {
    this.storage.unobserve?.();
    this.storage.unobserve = null;
  },
});
