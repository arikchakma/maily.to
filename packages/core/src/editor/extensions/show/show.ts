import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ShowView } from './show-view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    show: {
      setShow: () => ReturnType;
    };
  }
}

export const ShowExtension = Node.create({
  name: 'show',
  group: 'block',
  content: '(block|columns)+',
  draggable: true,

  addAttributes() {
    return {
      when: {
        default: 'shouldShow',
        parseHTML: (element) => {
          return element.getAttribute('when') || '';
        },
        renderHTML: (attributes) => {
          if (!attributes.when) {
            return {};
          }

          return {
            when: attributes.when,
          };
        },
      },
      isUpdatingKey: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setShow:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ShowView, {
      contentDOMElementTag: 'div',
    });
  },
});
