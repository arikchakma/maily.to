import {
  DEFAULT_VARIABLE_START_TRIGGER,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

export const ProtectVariableTrigger = Extension.create({
  name: 'protectVariableTrigger',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) {
            return null;
          }

          let hasVariable = false;
          newState.doc.descendants((node) => {
            if (node.type.name === MAILY_NODE_TYPES.VARIABLE) {
              hasVariable = true;
              return false;
            }

            return true;
          });

          if (hasVariable) {
            return null;
          }

          const paragraph = newState.doc.firstChild;
          if (!paragraph) {
            return null;
          }

          const text = paragraph.textContent;
          if (text.startsWith(DEFAULT_VARIABLE_START_TRIGGER)) {
            return null;
          }

          const tr = newState.tr;
          const start = 1;
          const end = start + paragraph.content.size;
          tr.replaceWith(start, end, newState.schema.text('{{'));
          return tr;
        },
      }),
    ];
  },
});
