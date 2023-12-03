import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ButtonComponent } from '../nodes/button';
import { AllowedLogoAlignment } from '../nodes/logo';

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
    button: {
      setButton: () => ReturnType;
    };
  }
}

export const ButtonExtension = Node.create({
  name: 'button',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      mailyComponent: {
        default: 'button',
      },
      text: {
        default: 'Button',
      },
      url: {
        default: '',
      },
      alignment: {
        default: 'left',
      },
      variant: {
        default: 'filled',
      },
      borderRadius: {
        default: 'smooth',
      },
      buttonColor: {
        default: 'rgb(0, 0, 0)',
      },
      textColor: {
        default: 'rgb(255, 255, 255)',
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
      'a',
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
      setButton:
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
    return ReactNodeViewRenderer(ButtonComponent);
  },
});
