import type { InlineImageAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

const DEFAULT_INLINE_IMAGE_SIZE = 20;

export type InlineImageOptions = {
  HTMLAttributes: Record<string, unknown>;
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

const INLINE_PARENTS = new Set(['A', 'B', 'EM', 'I', 'SPAN', 'STRONG']);

export const InlineImageExtension = Node.create<InlineImageOptions>({
  name: MAILY_NODE_TYPES.INLINE_IMAGE,
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
      src: {
        default: '',
        parseHTML: (element) => element.getAttribute('src') || '',
        renderHTML: (attributes) =>
          attributes.src ? { src: attributes.src } : {},
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) =>
          attributes.alt ? { alt: attributes.alt } : {},
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) =>
          attributes.title ? { title: attributes.title } : {},
      },
      width: {
        default: DEFAULT_INLINE_IMAGE_SIZE,
        parseHTML: (element) =>
          Number(element.getAttribute('width')) || DEFAULT_INLINE_IMAGE_SIZE,
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: DEFAULT_INLINE_IMAGE_SIZE,
        parseHTML: (element) =>
          Number(element.getAttribute('height')) || DEFAULT_INLINE_IMAGE_SIZE,
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      externalLink: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-external-link'),
        renderHTML: (attributes) =>
          attributes.externalLink
            ? { 'data-external-link': attributes.externalLink }
            : {},
      },
    };
  },

  addCommands() {
    return {
      setInlineImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      updateInlineImageAttributes:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  parseHTML() {
    return [
      { tag: `img[${DATA_NODE_TYPE_KEY}="${this.name}"]` },
      {
        tag: 'img[src]',
        priority: 60,
        getAttrs: (element) => {
          const parent = element.parentElement;

          return parent && INLINE_PARENTS.has(parent.tagName) ? null : false;
        },
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
});
