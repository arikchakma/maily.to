import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    logo: {
      setLogoImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;

      setLogoAttributes: (attributes: {
        size?: 'sm' | 'md' | 'lg';
        alignment?: 'left' | 'center' | 'right';
      }) => ReturnType;
    };
  }
}

export interface TiptapLogoAttributes {
  size: 'sm' | 'md' | 'lg';
  alignment: 'left' | 'center' | 'right';
  HTMLAttributes: Record<string, any>;
}

function getSizeStyle(size: TiptapLogoAttributes['size']): string {
  const sizes = { sm: '40px', md: '48px', lg: '64px' };
  return `height:${sizes[size] || '40px'}`;
}

function getAlignmentStyle(
  alignment: TiptapLogoAttributes['alignment']
): string[] {
  const alignments = {
    left: ['margin-right:auto', 'margin-left:0'],
    center: ['margin-right:auto', 'margin-left:auto'],
    right: ['margin-right:0', 'margin-left:auto'],
  };
  return alignments[alignment] || ['margin-right:auto', 'margin-left:0'];
}

export const TiptapLogoExtension = TiptapImage.extend<TiptapLogoAttributes>({
  name: 'logo',
  priority: 1000,

  addAttributes() {
    return {
      ...this.parent?.(),
      'maily-component': {
        default: 'logo',
        renderHTML: (attributes) => {
          return {
            'data-maily-component': attributes['maily-component'],
          };
        },
        parseHTML: (element: Element) =>
          element.getAttribute('data-maily-component'),
      },
      size: {
        default: 'sm',
        parseHTML: (element) => element.getAttribute('data-size'),
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          };
        },
      },
      alignment: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-alignment'),
        renderHTML: (attributes) => {
          return {
            'data-alignment': attributes.alignment,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setLogoImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setLogoAttributes:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes('logo', attributes);
        },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { size, alignment } = node.attrs as TiptapLogoAttributes;
    const style = [
      'position:relative',
      'margin-top:0',
      getSizeStyle(size),
      ...getAlignmentStyle(alignment),
    ];

    HTMLAttributes.style = style.join(';');
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
  parseHTML() {
    return [
      {
        tag: `img[data-maily-component="${this.name}"]`,
      },
    ];
  },
});
