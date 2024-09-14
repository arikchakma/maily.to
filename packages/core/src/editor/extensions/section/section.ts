import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: () => ReturnType;
    };
  }
}

export const Section = Node.create({
  name: 'section',
  group: 'block',
  content: '(block|columns)+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      borderRadius: {
        default: 0,
        parseHTML: (element) => {
          return Number(element?.style?.borderRadius?.replace(/['"]+/g, ''));
        },
        renderHTML: (attributes) => {
          if (!attributes.borderRadius) {
            return {};
          }

          return {
            style: `border-radius: ${attributes.borderRadius}px`,
          };
        },
      },
      padding: {
        default: 0,
        parseHTML: (element) => {
          return Number(element?.style?.padding?.replace(/['"]+/g, ''));
        },
        renderHTML: (attributes) => {
          if (!attributes.padding) {
            return {};
          }

          return {
            style: `padding: ${attributes.padding}px`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setSection:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              type: this.name,
            },
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'section',
        class: 'mly-bg-gray-100',
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-type="section"]',
      },
    ];
  },
});
