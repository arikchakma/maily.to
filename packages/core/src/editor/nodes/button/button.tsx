import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ButtonView } from './button-view';
import { updateAttributes } from '@/editor/utils/update-attribute';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';
import { AllowedLogoAlignment } from '../logo/logo';

export const DEFAULT_BUTTON_ALIGNMENT: AllowedLogoAlignment = 'left';
export const DEFAULT_BUTTON_VARIANT: AllowedButtonVariant = 'filled';
export const DEFAULT_BUTTON_BORDER_RADIUS: AllowedButtonBorderRadius = 'smooth';
export const DEFAULT_BUTTON_BACKGROUND_COLOR = null;
export const DEFAULT_BUTTON_TEXT_COLOR = null;

export const DEFAULT_BUTTON_PADDING_TOP = null;
export const DEFAULT_BUTTON_PADDING_RIGHT = null;
export const DEFAULT_BUTTON_PADDING_BOTTOM = null;
export const DEFAULT_BUTTON_PADDING_LEFT = null;

export const allowedButtonVariant = ['filled', 'outline'] as const;
export type AllowedButtonVariant = (typeof allowedButtonVariant)[number];

export const allowedButtonBorderRadius = ['sharp', 'smooth', 'round'] as const;
export type AllowedButtonBorderRadius =
  (typeof allowedButtonBorderRadius)[number];

export type ButtonAttributes = {
  text: string;
  isTextVariable: boolean;

  url: string;
  isUrlVariable: boolean;

  alignment: AllowedLogoAlignment;
  variant: AllowedButtonVariant;
  borderRadius: AllowedButtonBorderRadius;
  buttonColor: string;
  textColor: string;

  showIfKey: string;

  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    button: {
      setButton: () => ReturnType;
      updateButton: (attrs: Partial<ButtonAttributes>) => ReturnType;
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
      text: {
        default: 'Button',
        parseHTML: (element) => {
          return element.getAttribute('data-text') || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-text': attributes.text,
          };
        },
      },
      isTextVariable: {
        default: false,
        parseHTML: (element) => {
          return element.getAttribute('data-is-text-variable') === 'true';
        },
        renderHTML: (attributes) => {
          if (!attributes.isTextVariable) {
            return {};
          }

          return {
            'data-is-text-variable': 'true',
          };
        },
      },

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
      // Later we will remove this attribute
      // and use the `url` attribute instead when implement
      // the URL variable feature
      isUrlVariable: {
        default: false,
        parseHTML: (element) => {
          return element.getAttribute('data-is-url-variable') === 'true';
        },
        renderHTML: (attributes) => {
          if (!attributes.isUrlVariable) {
            return {};
          }

          return {
            'data-is-url-variable': 'true',
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
      variant: {
        default: DEFAULT_BUTTON_VARIANT,
        parseHTML: (element) => {
          return element.getAttribute('data-variant') || DEFAULT_BUTTON_VARIANT;
        },
        renderHTML: (attributes) => {
          return {
            'data-variant': attributes.variant,
          };
        },
      },
      borderRadius: {
        default: DEFAULT_BUTTON_BORDER_RADIUS,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-border-radius') ||
            DEFAULT_BUTTON_BORDER_RADIUS
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-border-radius': attributes.borderRadius,
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

      buttonColor: DEFAULT_BUTTON_BACKGROUND_COLOR,
      textColor: DEFAULT_BUTTON_TEXT_COLOR,

      paddingTop: DEFAULT_BUTTON_PADDING_TOP,
      paddingRight: DEFAULT_BUTTON_PADDING_RIGHT,
      paddingBottom: DEFAULT_BUTTON_PADDING_BOTTOM,
      paddingLeft: DEFAULT_BUTTON_PADDING_LEFT,
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': this.name,
      }),
    ];
  },

  addCommands() {
    return {
      setButton:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [],
          });
        },
      updateButton: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonView, {
      contentDOMElementTag: 'div',
      className: 'mly-relative',
    });
  },
});
