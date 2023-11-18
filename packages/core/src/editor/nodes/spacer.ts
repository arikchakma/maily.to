import { mergeAttributes, Node } from '@tiptap/core';

export interface SpacerOptions {
  height: 'sm' | 'md' | 'lg' | 'xl';
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spacer: {
      setSpacer: (options: { height: SpacerOptions['height'] }) => ReturnType;
      setSpacerSize: (height: SpacerOptions['height']) => ReturnType;
      unsetSpacer: () => ReturnType;
    };
  }
}

function getHeightStyle(height: SpacerOptions['height']): string {
  const heights = { sm: '8px', md: '16px', lg: '32px', xl: '64px' };
  return `width: 100%; height: ${heights[height] || '8px'};`;
}

export const Spacer = Node.create<SpacerOptions>({
  name: 'spacer',
  priority: 1000,

  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-height'),
        renderHTML: (attributes) => {
          return {
            'data-height': attributes.height,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setSpacer:
        (options) =>
        ({ chain, commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              height: options.height,
            },
          });
        },

      setSpacerSize:
        (height) =>
        ({ commands }) => {
          if (!['sm', 'md', 'lg', 'xl'].includes(height)) {
            throw new Error('Invalid spacer height');
          }
          return commands.updateAttributes('spacer', { height });
        },

      unsetSpacer:
        () =>
        ({ commands }) => {
          return commands.deleteNode('spacer');
        },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { height } = node.attrs as SpacerOptions;
    HTMLAttributes.style = getHeightStyle(height);
    return [
      'div',
      mergeAttributes(
        {
          'data-maily-component': this.name,
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          class: 'spacer',
          contenteditable: false,
        }
      ),
    ];
  },
  parseHTML() {
    return [{ tag: `div[data-maily-component="${this.name}"]` }];
  },
});
