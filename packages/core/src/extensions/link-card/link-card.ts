import type { LinkCardAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { LinkCardView } from './link-card-view';

export type LinkCardOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkCard: {
      setLinkCard: (attrs?: Partial<LinkCardAttributes>) => ReturnType;
      updateLinkCardAttributes: (
        attrs: Partial<LinkCardAttributes>
      ) => ReturnType;
    };
  }
}

export const LinkCardExtension = Node.create<LinkCardOptions>({
  name: MAILY_NODE_TYPES.LINK_CARD,
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-title') || '',
        renderHTML: (attributes) => ({ 'data-title': attributes.title }),
      },
      description: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-description') || '',
        renderHTML: (attributes) => ({
          'data-description': attributes.description,
        }),
      },
      link: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-link') || '',
        renderHTML: (attributes) => ({ 'data-link': attributes.link }),
      },
      linkTitle: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-link-title') || '',
        renderHTML: (attributes) => ({
          'data-link-title': attributes.linkTitle,
        }),
      },
      image: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-image') || '',
        renderHTML: (attributes) => ({ 'data-image': attributes.image }),
      },
      subTitle: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-sub-title') || '',
        renderHTML: (attributes) => ({ 'data-sub-title': attributes.subTitle }),
      },
      badgeText: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-badge-text') || '',
        renderHTML: (attributes) => ({
          'data-badge-text': attributes.badgeText,
        }),
      },
    };
  },

  addCommands() {
    return {
      setLinkCard:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
      updateLinkCardAttributes:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name, contenteditable: false },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView, {
      attrs: () => ({ [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.LINK_CARD }),
    });
  },
});
