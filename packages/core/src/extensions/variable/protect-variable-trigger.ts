import {
  DEFAULT_VARIABLE_START_TRIGGER,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

import { isRemoteChange } from '~/utils/collaboration';

export const ProtectVariableTrigger = Extension.create({
  name: 'protectVariableTrigger',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction(transactions, _oldState, newState) {
          // The sender already fixed a remote change. A second fix from each
          // collaborator would conflict.
          if (
            !transactions.some((tr) => tr.docChanged) ||
            transactions.some(isRemoteChange)
          ) {
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

          if (
            paragraph.textContent.startsWith(DEFAULT_VARIABLE_START_TRIGGER)
          ) {
            return null;
          }

          const tr = newState.tr;
          const start = 1;

          return tr.replaceWith(
            start,
            start + paragraph.content.size,
            newState.schema.text(DEFAULT_VARIABLE_START_TRIGGER)
          );
        },
      }),
    ];
  },
});
