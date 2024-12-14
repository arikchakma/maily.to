import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';
import { LogoView } from './logo-view';

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

export interface LogoAttributes {
  src?: string;
  size?: AllowedLogoSize;
  alignment?: AllowedLogoAlignment;

  showIfKey: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    logo: {
      setLogoImage: (options: LogoOptions) => ReturnType;
      setLogoAttributes: (attributes: Partial<LogoAttributes>) => ReturnType;
    };
  }
}

const DEFAULT_ALIGNMENT: AllowedLogoAlignment = 'left';
export const DEFAULT_LOGO_SIZE: AllowedLogoSize = 'sm';

export const logoSizes: Record<AllowedLogoSize, string> = {
  sm: '40px',
  md: '48px',
  lg: '64px',
};

function getAlignmentStyle(alignment: AllowedLogoAlignment): string[] {
  const alignments: Record<AllowedLogoAlignment, string[]> = {
    left: ['margin-right:auto', 'margin-left:0'],
    center: ['margin-right:auto', 'margin-left:auto'],
    right: ['margin-right:0', 'margin-left:auto'],
  };

  return alignments[alignment] || alignments[DEFAULT_ALIGNMENT];
}

export const LogoExtension = TiptapImage.extend({
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
  parseHTML() {
    return [
      {
        tag: `img[data-maily-component="${this.name}"]`,
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(LogoView, {
      className: 'mly-relative',
    });
  },
});
