import type { SectionAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

import { exitOnTripleEnter } from '~/utils/exit-on-triple-enter';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: () => ReturnType;
      updateSection: (attrs: Partial<SectionAttributes>) => ReturnType;
    };
  }
}

export const SectionExtension = Node.create({
  name: MAILY_NODE_TYPES.SECTION,
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  addCommands() {
    return {
      setSection:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            content: [{ type: MAILY_NODE_TYPES.PARAGRAPH }],
          }),
      updateSection:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        return exitOnTripleEnter({ editor, nodeName: this.name });
      },
    };
  },

  parseHTML() {
    return [
      { tag: `div[${DATA_NODE_TYPE_KEY}="${MAILY_NODE_TYPES.SECTION}"]` },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.SECTION },
        HTMLAttributes
      ),
      0,
    ];
  },
});
