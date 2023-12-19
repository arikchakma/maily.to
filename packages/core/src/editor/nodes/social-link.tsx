import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';

export const allowedSocialLinkSize = ['sm', 'md', 'lg'] as const;
export type AllowedSocialLinkSize = (typeof allowedSocialLinkSize)[number];

interface SocialLinkOptions {
  src: string;
  alt?: string;
  title?: string;
  size?: AllowedSocialLinkSize;
}

interface SocialLinkAttributes {
  size?: AllowedSocialLinkSize;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    social: {
      setSocialLinkImage: (options: SocialLinkOptions) => ReturnType;
      setSocialLinkAttributes: (attributes: SocialLinkAttributes) => ReturnType;
    };
  }
}

export interface TiptapSocialLinkAttributes {
  size: AllowedSocialLinkSize;
  HTMLAttributes: Record<string, any>;
}

const DEFAULT_SIZE: AllowedSocialLinkSize = 'sm';

function getSizeStyle(size: TiptapSocialLinkAttributes['size']): {
  width: string;
  height: string;
} {
  const sizes: Record<AllowedSocialLinkSize, string> = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  };
  return {
    width: sizes[size],
    height: sizes[size],
  };
}

export const SocialLinkNode = TiptapImage.extend<TiptapSocialLinkAttributes>({
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
          element.getAttribute('data-size') as AllowedSocialLinkSize,
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
      setSocialLinkImage:
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

      setSocialLinkAttributes:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes('social', attributes);
        },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { size } = node.attrs as TiptapSocialLinkAttributes;

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
