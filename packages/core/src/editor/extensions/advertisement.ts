import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { AllowedLogoAlignment } from '../nodes/logo';
import { AdvertisementComponent } from '../nodes/advertisement';

export const allowedButtonVariant = ['filled', 'outline'] as const;
export type AllowedButtonVariant = (typeof allowedButtonVariant)[number];

export const allowedButtonBorderRadius = ['sharp', 'smooth', 'round'] as const;
export type AllowedButtonBorderRadius =
  (typeof allowedButtonBorderRadius)[number];

export interface ButtonOptions {
  text: string;
  url: string;
  alignment: AllowedLogoAlignment;
  variant: AllowedButtonVariant;
  borderRadius: AllowedButtonBorderRadius;
  buttonColor: string;
  textColor: string;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    advertisement: {
      setAdvertisement: () => ReturnType;
    };
  }
}

export const AdvertisementExtension = Node.create({
  name: 'advertisement',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      mailyComponent: {
        default: 'advertisement',
      },
      layout: {
        default: 'left-image',
      },
      title: {
        default: '',
      },
      description: {
        default: '',
      },
      link: {
        default: '',
      },
      linkTitle: {
        default: '',
      },
      image: {
        default: '',
      },
      subTitle: {
        default: '',
      },
      badgeText: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `a[data-maily-component="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-maily-component': this.name,
        },
        HTMLAttributes
      ),
    ];
  },

  addCommands() {
    return {
      setAdvertisement:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              mailyComponent: this.name,
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdvertisementComponent);
  },
});
