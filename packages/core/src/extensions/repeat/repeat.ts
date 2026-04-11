import type { RepeatAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DATA_VISIBILITY_RULE_KEY,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { RepeatView } from './repeat-view';

export const DEFAULT_REPEAT_EACH = '{{items}}';

export type RepeatOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    repeat: {
      setRepeat: (attrs?: Partial<RepeatAttributes>) => ReturnType;
      updateRepeat: (attrs: Partial<RepeatAttributes>) => ReturnType;
    };
  }
}

export const RepeatExtension = Node.create<RepeatOptions>({
  name: MAILY_NODE_TYPES.REPEAT,
  group: 'block',
  content: '(block|columns)+',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      each: {
        default: DEFAULT_REPEAT_EACH,
        parseHTML: (element) => {
          return element.getAttribute('data-each') || DEFAULT_REPEAT_EACH;
        },
        renderHTML: (attributes) => {
          return {
            'data-each': attributes.each,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: this.name,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setRepeat:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
            content: [
              {
                type: MAILY_NODE_TYPES.PARAGRAPH,
              },
            ],
          });
        },
      updateRepeat:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(RepeatView, {
      className: 'mly:relative',
      attrs: (props) => {
        return {
          [DATA_NODE_TYPE_KEY]: this.name,
          ...(props.node.attrs.visibilityRule
            ? { [DATA_VISIBILITY_RULE_KEY]: '' }
            : {}),
        };
      },
    });
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Backspace': ({ editor }) => {
        return editor.commands.deleteNode(this.name);
      },
    };
  },
});
