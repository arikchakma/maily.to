import type { SectionAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_BORDER_STYLE,
  FIELD_MODE,
  getBorderStyle,
  getMarginStyle,
  getPaddingStyle,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { stringify } from 'stylecast';

import { exitOnTripleEnter } from '~/utils/exit-on-triple-enter';

export const DEFAULT_SECTION_BACKGROUND_COLOR = '#f7f7f7';
export const DEFAULT_SECTION_ALIGN = 'left';
export const DEFAULT_SECTION_BORDER_WIDTH = 2;
export const DEFAULT_SECTION_BORDER_COLOR = '#e2e2e2';
export const DEFAULT_SECTION_BORDER_RADIUS = 0;

export const DEFAULT_SECTION_MARGIN_TOP = 0;
export const DEFAULT_SECTION_MARGIN_RIGHT = 0;
export const DEFAULT_SECTION_MARGIN_BOTTOM = 20;
export const DEFAULT_SECTION_MARGIN_LEFT = 0;

export const DEFAULT_SECTION_PADDING_TOP = 0;
export const DEFAULT_SECTION_PADDING_RIGHT = 0;
export const DEFAULT_SECTION_PADDING_BOTTOM = 0;
export const DEFAULT_SECTION_PADDING_LEFT = 0;

export type SectionOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: () => ReturnType;
      updateSection: (attrs: Partial<SectionAttributes>) => ReturnType;
    };
  }
}

export const SectionExtension = Node.create<SectionOptions>({
  name: MAILY_NODE_TYPES.SECTION,
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      backgroundColor: {
        default: DEFAULT_SECTION_BACKGROUND_COLOR,
        parseHTML: (element) => {
          return element.style.backgroundColor;
        },
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor};--bg-color: ${attributes.backgroundColor}`,
          };
        },
      },
      align: {
        default: DEFAULT_SECTION_ALIGN,
        parseHTML: (element) => {
          return element.getAttribute('align') || DEFAULT_SECTION_ALIGN;
        },
        renderHTML(attributes) {
          if (!attributes.align) {
            return {};
          }

          return {
            align: attributes.align,
          };
        },
      },
      paddingMode: {
        default: FIELD_MODE.UNIFORM,
      },
      paddingTop: {
        default: DEFAULT_SECTION_PADDING_TOP,
      },
      paddingRight: {
        default: DEFAULT_SECTION_PADDING_RIGHT,
      },
      paddingBottom: {
        default: DEFAULT_SECTION_PADDING_BOTTOM,
      },
      paddingLeft: {
        default: DEFAULT_SECTION_PADDING_LEFT,
      },

      marginMode: {
        default: FIELD_MODE.MIXED,
      },
      marginTop: {
        default: DEFAULT_SECTION_MARGIN_TOP,
      },
      marginRight: {
        default: DEFAULT_SECTION_MARGIN_RIGHT,
      },
      marginBottom: {
        default: DEFAULT_SECTION_MARGIN_BOTTOM,
      },
      marginLeft: {
        default: DEFAULT_SECTION_MARGIN_LEFT,
      },

      borderStyle: {
        default: DEFAULT_BORDER_STYLE,
      },
      borderColor: {
        default: DEFAULT_SECTION_BORDER_COLOR,
      },
      borderWidthMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopWidth: {
        default: DEFAULT_SECTION_BORDER_WIDTH,
      },
      borderRightWidth: {
        default: DEFAULT_SECTION_BORDER_WIDTH,
      },
      borderBottomWidth: {
        default: DEFAULT_SECTION_BORDER_WIDTH,
      },
      borderLeftWidth: {
        default: DEFAULT_SECTION_BORDER_WIDTH,
      },
      borderRadiusMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopLeftRadius: {
        default: DEFAULT_SECTION_BORDER_RADIUS,
      },
      borderTopRightRadius: {
        default: DEFAULT_SECTION_BORDER_RADIUS,
      },
      borderBottomLeftRadius: {
        default: DEFAULT_SECTION_BORDER_RADIUS,
      },
      borderBottomRightRadius: {
        default: DEFAULT_SECTION_BORDER_RADIUS,
      },
    };
  },

  addCommands() {
    return {
      setSection:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              type: this.name,
            },
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },
      updateSection: (attrs) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        };
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Exit section on triple enter
      Enter: ({ editor }) => {
        return exitOnTripleEnter(editor, this.name);
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = HTMLAttributes as SectionAttributes;

    const borderStyle = stringify(
      getBorderStyle(attrs) as Record<string, string>,
      { kebabCase: true }
    );

    const paddingStyle = stringify(
      getPaddingStyle(attrs) as Record<string, string>,
      { kebabCase: true }
    );

    const marginStyle = stringify(
      getMarginStyle(attrs) as Record<string, string>,
      { kebabCase: true }
    );

    return [
      'table',
      {
        [DATA_NODE_TYPE_KEY]: this.name,
        border: 0,
        cellpadding: 0,
        cellspacing: 0,
        class: 'mly:w-full mly:border-separate mly:relative mly:table-fixed',
        style: `${marginStyle}`,
      },
      [
        'tbody',
        {
          class: 'mly:w-full',
        },
        [
          'tr',
          {
            class: 'mly:w-full',
          },
          [
            'td',
            mergeAttributes(HTMLAttributes, {
              [DATA_NODE_TYPE_KEY]: 'section-cell',
              style: `${paddingStyle} ${borderStyle} text-align: ${attrs.align || DEFAULT_SECTION_ALIGN};`,
              class: 'mly:w-full',
            }),
            0,
          ],
        ],
      ],
    ];
  },

  parseHTML() {
    return [
      {
        tag: `table[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },
});
