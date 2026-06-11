import type {
  AllowedButtonKind,
  AllowedFieldMode,
  AllowedTextAlignment,
  BorderStyleConfig,
  FontStyleAttributes,
  TextDirection,
} from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DATA_VISIBILITY_RULE_KEY,
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_STYLE,
  DEFAULT_BUTTON_KIND,
  FIELD_MODE,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ButtonView } from './button-view';

export const DEFAULT_BUTTON_ALIGNMENT = null;
export const DEFAULT_BUTTON_BACKGROUND_COLOR = null;
export const DEFAULT_BUTTON_TEXT_COLOR = null;
export const DEFAULT_BUTTON_BORDER_RADIUS = 9999;

export type ButtonAttributes = {
  dir: TextDirection | null;

  url: string;
  kind: AllowedButtonKind;

  alignment: AllowedTextAlignment | null;

  backgroundColor: string | null;
  color: string | null;

  paddingMode: AllowedFieldMode;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
} & BorderStyleConfig &
  FontStyleAttributes;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: (attrs?: Partial<ButtonAttributes>) => ReturnType;
      updateButtonAttributes: (attrs: Partial<ButtonAttributes>) => ReturnType;
    };
  }
}

export const ButtonExtension = Node.create({
  name: MAILY_NODE_TYPES.BUTTON,
  group: 'block',
  content: '(inline)+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      url: {
        default: '',
        parseHTML: (element) => {
          return element.getAttribute('data-url') || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-url': attributes.url,
          };
        },
      },

      kind: {
        default: DEFAULT_BUTTON_KIND,
        parseHTML: (element) => {
          return element.getAttribute('data-kind') || DEFAULT_BUTTON_KIND;
        },
        renderHTML: (attributes) => {
          return {
            'data-kind': attributes.kind,
          };
        },
      },

      alignment: {
        default: DEFAULT_BUTTON_ALIGNMENT,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-alignment') || DEFAULT_BUTTON_ALIGNMENT
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-alignment': attributes.alignment,
          };
        },
      },

      backgroundColor: {
        default: DEFAULT_BUTTON_BACKGROUND_COLOR,
      },
      color: {
        default: DEFAULT_BUTTON_TEXT_COLOR,
      },

      paddingMode: {
        default: FIELD_MODE.MIXED,
      },
      paddingTop: {
        default: null,
      },
      paddingRight: {
        default: null,
      },
      paddingBottom: {
        default: null,
      },
      paddingLeft: {
        default: null,
      },

      borderColor: {
        default: DEFAULT_BORDER_COLOR,
      },
      borderRadiusMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopLeftRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
      },
      borderTopRightRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
      },
      borderBottomLeftRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
      },
      borderBottomRightRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
      },

      borderWidthMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopWidth: {
        default: 0,
      },
      borderRightWidth: {
        default: 0,
      },
      borderBottomWidth: {
        default: 0,
      },
      borderLeftWidth: {
        default: 0,
      },

      borderStyle: {
        default: DEFAULT_BORDER_STYLE,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: this.name,
      }),
    ];
  },

  addCommands() {
    return {
      setButton: (attrs) => {
        return ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
            content: [
              {
                type: MAILY_NODE_TYPES.TEXT,
                text: 'Click me',
              },
            ],
          });
        };
      },
      updateButtonAttributes: (attrs) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        };
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonView, {
      className: 'mly:relative',
      attrs: (props) => {
        const { node } = props;
        const attrs = node.attrs as ButtonAttributes;
        const { dir } = attrs;

        return {
          [DATA_NODE_TYPE_KEY]: this.name,
          ...(dir ? { dir } : {}),
          ...(node.attrs.visibilityRule
            ? { [DATA_VISIBILITY_RULE_KEY]: '' }
            : {}),
        };
      },
    });
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Backspace': ({ editor }) => {
        return editor.commands.deleteNode(this.name);
      },
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type.name !== this.name) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        if (!isAtEnd) {
          return false;
        }

        return editor
          .chain()
          .insertContent({
            type: MAILY_NODE_TYPES.PARAGRAPH,
            content: [],
          })
          .run();
      },
    };
  },
});
