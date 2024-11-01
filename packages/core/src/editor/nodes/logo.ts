import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import { DEFAULT_SECTION_SHOW_IF_KEY } from './section/section';

export const allowedLogoSize = ['sm', 'md', 'lg'] as const;
export type AllowedLogoSize = (typeof allowedLogoSize)[number];

export const allowedLogoAlignment = ['left', 'center', 'right'] as const;
export type AllowedLogoAlignment = (typeof allowedLogoAlignment)[number];

interface LogoOptions {
  src: string;
  alt?: string;
  title?: string;
  size?: AllowedLogoSize;
  alignment?: AllowedLogoAlignment;
}

interface LogoAttributes {
  src?: string;
  size?: AllowedLogoSize;
  alignment?: AllowedLogoAlignment;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    logo: {
      setLogoImage: (options: LogoOptions) => ReturnType;
      setLogoAttributes: (attributes: LogoAttributes) => ReturnType;
    };
  }
}

export interface TiptapLogoAttributes {
  size: AllowedLogoSize;
  alignment: AllowedLogoAlignment;
  HTMLAttributes: Record<string, any>;

  showIfKey: string;
}

const DEFAULT_ALIGNMENT: AllowedLogoAlignment = 'left';
export const DEFAULT_LOGO_SIZE: AllowedLogoSize = 'sm';

function getSizeStyle(size: TiptapLogoAttributes['size']): string[] {
  const sizes: Record<AllowedLogoSize, string> = {
    sm: '40px',
    md: '48px',
    lg: '64px',
  };
  return [
    `height:${sizes[size] || sizes[DEFAULT_LOGO_SIZE]}`,
    `width:${sizes[size] || sizes[DEFAULT_LOGO_SIZE]}`,
  ];
}

function getAlignmentStyle(alignment: AllowedLogoAlignment): string[] {
  const alignments: Record<AllowedLogoAlignment, string[]> = {
    left: ['margin-right:auto', 'margin-left:0'],
    center: ['margin-right:auto', 'margin-left:auto'],
    right: ['margin-right:0', 'margin-left:auto'],
  };

  return alignments[alignment] || alignments[DEFAULT_ALIGNMENT];
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
        default: DEFAULT_LOGO_SIZE,
        parseHTML: (element) =>
          element.getAttribute('data-size') as AllowedLogoSize,
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          };
        },
      },
      alignment: {
        default: DEFAULT_ALIGNMENT,
        parseHTML: (element) =>
          element.getAttribute('data-alignment') as AllowedLogoAlignment,
        renderHTML: (attributes) => {
          return {
            'data-alignment': attributes.alignment,
          };
        },
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
      ...getSizeStyle(size),
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
