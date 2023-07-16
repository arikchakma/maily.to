import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import ButtonComponent from './button';

export interface ButtonOptions {
  text: string;
  url: string;
  alignment: 'left' | 'center' | 'right';
  variant: 'filled' | 'outline';
  borderRadius: 'sharp' | 'smooth' | 'round';
  buttonColor: string;
  textColor: string;
  HTMLAttributes: Record<string, any>;
}

export const ButtonExtension = Node.create({
  name: 'button',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      mailboxComponent: {
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
        tag: `a[data-mailbox-component="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        {
          'data-mailbox-component': this.name,
        },
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent);
  },
});
