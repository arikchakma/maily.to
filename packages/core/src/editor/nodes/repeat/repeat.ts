import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { RepeatView } from './repeat-view';
import { updateAttributes } from '@/editor/utils/update-attribute';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';

type RepeatAttributes = {
  each: string;
  isUpdatingKey: boolean;
  showIfKey: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    repeat: {
      setRepeat: () => ReturnType;
      updateRepeat: (attrs: Partial<RepeatAttributes>) => ReturnType;
    };
  }
}

export const RepeatExtension = Node.create({
  name: 'repeat',
  group: 'block',
  content: '(block|columns)+',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      each: {
        default: 'items',
        parseHTML: (element) => {
          return element.getAttribute('each') || '';
        },
        renderHTML: (attributes) => {
          if (!attributes.each) {
            return {};
          }

          return {
            each: attributes.each,
          };
        },
      },
      isUpdatingKey: {
        default: false,
      },
      showIfKey: {
        default: DEFAULT_SECTION_SHOW_IF_KEY,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-show-if-key') ||
            DEFAULT_SECTION_SHOW_IF_KEY
          );
        },
        renderHTML(attributes) {
          if (!attributes.showIfKey) {
            return {};
          }

          return {
            'data-show-if-key': attributes.showIfKey,
          };
        },
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
      setRepeat:
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
      updateRepeat: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(RepeatView, {
      contentDOMElementTag: 'div',
      className: 'mly:relative',
    });
  },
});
