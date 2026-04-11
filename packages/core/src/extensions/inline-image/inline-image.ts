import { DATA_NODE_TYPE_KEY } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { InlineImageView } from './inline-image-view';

export type InlineImageAttributes = {
  src: string;
  alt: string | null;
  title: string | null;
  width: number;
  height: number;
  externalLink: string | null;
};

type InlineImageOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineImage: {
      setInlineImage: (attrs: Partial<InlineImageAttributes>) => ReturnType;
      updateInlineImageAttributes: (
        attrs: Partial<InlineImageAttributes>
      ) => ReturnType;
    };
  }
}

export const InlineImageExtension = Node.create<InlineImageOptions>({
  name: 'inlineImage',

  group: 'inline',

  inline: true,

  atom: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: null },
      title: { default: null },
      width: { default: 20 },
      height: { default: 20 },
      externalLink: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: `img[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addCommands() {
    return {
      setInlineImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
      updateInlineImageAttributes:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineImageView, {
      as: 'span',
      attrs: {
        [DATA_NODE_TYPE_KEY]: this.name,
        class: 'mly:relative mly:inline-block',
      },
    });
  },
});
