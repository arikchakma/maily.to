import { mergeAttributes, Node } from '@tiptap/core';
import TiptapLink from '@tiptap/extension-link';
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
        default: 'https://arikko.dev',
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
        default: '#000000',
      },
      textColor: {
        default: '#efefef',
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
