import type { RepeatAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

export const DEFAULT_REPEAT_EACH = '{{items}}';

export type RepeatOptions = {
  HTMLAttributes: Record<string, unknown>;
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
  content: 'block+',
  defining: true,
  isolating: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      each: {
        default: DEFAULT_REPEAT_EACH,
        parseHTML: (element) => {
          return element.getAttribute('data-each') || DEFAULT_REPEAT_EACH;
        },
        renderHTML: (attributes) => ({ 'data-each': attributes.each }),
      },
    };
  },

  addCommands() {
    return {
      setRepeat:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { ...attrs },
            content: [{ type: MAILY_NODE_TYPES.PARAGRAPH }],
          }),
      updateRepeat:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Backspace': ({ editor }) => editor.commands.deleteNode(this.name),
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
});
