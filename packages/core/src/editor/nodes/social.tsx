import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';

export const allowedSocialSize = ['sm', 'md', 'lg'] as const;
export type AllowedSocialSize = (typeof allowedSocialSize)[number];

interface SocialOptions {
  src: string;
  alt?: string;
  title?: string;
  size?: AllowedSocialSize;
}

interface SocialAttributes {
  size?: AllowedSocialSize;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    social: {
      setSocialImage: (options: SocialOptions) => ReturnType;
      setSocialAttributes: (attributes: SocialAttributes) => ReturnType;
    };
  }
}

export interface TiptapSocialAttributes {
  size: AllowedSocialSize;
  HTMLAttributes: Record<string, any>;
}

const DEFAULT_SIZE: AllowedSocialSize = 'sm';

function getSizeStyle(size: TiptapSocialAttributes['size']): {
  width: string;
  height: string;
} {
  const sizes: Record<AllowedSocialSize, string> = {
    sm: '40px',
    md: '48px',
    lg: '64px',
  };
  return {
    width: sizes[size],
    height: sizes[size],
  };
}

export const SocialNode = TiptapImage.extend<TiptapSocialAttributes>({
  name: 'social',
  priority: 2000,

  addOptions() {
    return {
      inline: true,
      HTMLAttributes: {},
      size: DEFAULT_SIZE,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      'maily-component': {
        default: 'social',
        renderHTML: () => {
          return {
            'data-maily-component': this.name,
          };
        },
        parseHTML: (element: Element) =>
          element.getAttribute('data-maily-component'),
      },
      size: {
        default: DEFAULT_SIZE,
        parseHTML: (element) =>
          element.getAttribute('data-size') as AllowedSocialSize,
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setSocialImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent([
            {
              type: this.name,
              attrs: options,
            },
            {
              type: 'text',
              text: ' ',
            },
          ]);
        },

      setSocialAttributes:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes('social', attributes);
        },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { size } = node.attrs as TiptapSocialAttributes;

    const { width, height } = getSizeStyle(size);
    HTMLAttributes.style = `width: ${width}; height: ${height}; display: inline-block; margin: 0;`;
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
