import type { ButtonAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_BUTTON_KIND,
  isAllowedButtonKind,
  isAllowedTextAlignment,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

const DEFAULT_BUTTON_ALIGN = TEXT_ALIGNMENTS.CENTER;

export type ButtonOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: (attrs?: Partial<ButtonAttributes>) => ReturnType;
      updateButtonAttributes: (attrs: Partial<ButtonAttributes>) => ReturnType;
    };
  }
}

export const ButtonExtension = Node.create<ButtonOptions>({
  name: MAILY_NODE_TYPES.BUTTON,
  group: 'block',
  content: '(inline)*',
  defining: true,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      url: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-url') || '',
        renderHTML: (attributes) => ({ 'data-url': attributes.url }),
      },
      kind: {
        default: DEFAULT_BUTTON_KIND,
        parseHTML: (element) => {
          const kind = element.getAttribute('data-kind');

          return isAllowedButtonKind(kind) ? kind : DEFAULT_BUTTON_KIND;
        },
        renderHTML: (attributes) => ({ 'data-kind': attributes.kind }),
      },
      align: {
        default: DEFAULT_BUTTON_ALIGN,
        parseHTML: (element) => {
          const align = element.getAttribute('data-align');

          return isAllowedTextAlignment(align) ? align : DEFAULT_BUTTON_ALIGN;
        },
        renderHTML: (attributes) => ({ 'data-align': attributes.align }),
      },
    };
  },

  addCommands() {
    return {
      setButton:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { ...attrs },
            content: [{ type: MAILY_NODE_TYPES.TEXT, text: 'Button' }],
          }),
      updateButtonAttributes:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Backspace': ({ editor }) => editor.commands.deleteNode(this.name),
      // `isolating` stops ProseMirror joining an empty button into whatever
      // precedes it, so backspacing an empty one has to remove it here.
      Backspace: ({ editor }) => {
        const { $anchor, empty } = editor.state.selection;
        if (
          !empty ||
          $anchor.parent.type.name !== this.name ||
          $anchor.parent.content.size > 0
        ) {
          return false;
        }

        return editor.commands.deleteNode(this.name);
      },
      Enter: ({ editor }) => {
        const { $from, empty } = editor.state.selection;
        if (!empty || $from.parent.type.name !== this.name) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        if (!isAtEnd) {
          return false;
        }

        return editor
          .chain()
          .insertContent({ type: MAILY_NODE_TYPES.PARAGRAPH, content: [] })
          .run();
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
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
});
