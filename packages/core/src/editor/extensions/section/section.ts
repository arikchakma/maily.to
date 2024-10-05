import { updateAttributes } from '@/editor/utils/update-attribute';
import { mergeAttributes, Node } from '@tiptap/core';

export const DEFAULT_SECTION_BACKGROUND_COLOR = '#f7f7f7';
export const DEFAULT_SECTION_PADDING = 5;
export const DEFAULT_SECTION_ALIGN = 'left';
export const DEFAULT_SECTION_BORDER_WIDTH = 1;
export const DEFAULT_SECTION_BORDER_COLOR = '#e2e2e2';
export const DEFAULT_SECTION_BORDER_RADIUS = 0;
export const DEFAULT_SECTION_MARGIN = 0;

type SectionAttributes = {
  borderRadius: number;
  padding: number;
  backgroundColor: string;
  align: string;
  borderWidth: number;
  borderColor: string;
  margin: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: () => ReturnType;
      updateSection: (attrs: Partial<SectionAttributes>) => ReturnType;
    };
  }
}

export const Section = Node.create({
  name: 'section',
  group: 'block',
  content: '(block|columns)+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      borderRadius: {
        default: 0,
        parseHTML: (element) => {
          return Number(element?.style?.borderRadius?.replace(/['"]+/g, ''));
        },
        renderHTML: (attributes) => {
          if (!attributes.borderRadius) {
            return {};
          }

          return {
            style: `border-radius: ${attributes.borderRadius}px`,
          };
        },
      },
      padding: {
        default: DEFAULT_SECTION_PADDING,
        parseHTML: (element) => {
          return Number(element?.style?.padding?.replace(/['"]+/g, ''));
        },
        renderHTML: (attributes) => {
          if (!attributes.padding) {
            return {};
          }

          return {
            style: `padding: ${attributes.padding}px`,
          };
        },
      },
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
            style: `background-color: ${attributes.backgroundColor}`,
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
      borderWidth: {
        default: DEFAULT_SECTION_BORDER_WIDTH,
        parseHTML: (element) => {
          return (
            Number(element?.style?.borderWidth?.replace(/['"]+/g, '')) || 0
          );
        },
        renderHTML: (attributes) => {
          if (!attributes.borderWidth) {
            return {};
          }

          return {
            style: `border-width: ${attributes.borderWidth}px`,
          };
        },
      },
      borderColor: {
        default: DEFAULT_SECTION_BORDER_COLOR,
        parseHTML: (element) => {
          return element.style.borderColor;
        },
        renderHTML: (attributes) => {
          if (!attributes.borderColor) {
            return {};
          }

          return {
            style: `border-color: ${attributes.borderColor}`,
          };
        },
      },
      margin: {
        default: DEFAULT_SECTION_MARGIN,
        parseHTML: (element) => {
          return Number(element?.style?.margin?.replace(/['"]+/g, '')) || 0;
        },
        renderHTML: (attributes) => {
          if (!attributes.margin) {
            return {};
          }

          return {
            margin: attributes.margin,
          };
        },
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
      updateSection: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      {
        'data-type': this.name,
        border: 0,
        cellpadding: 0,
        cellspacing: 0,
        class: 'mly-w-full mly-border-separate',
        style: `margin: ${HTMLAttributes.margin}px`,
      },
      [
        'tbody',
        {
          class: 'mly-w-full',
        },
        [
          'tr',
          {
            class: 'mly-w-full',
          },
          [
            'td',
            mergeAttributes(HTMLAttributes, {
              'data-type': 'section-cell',
              style: 'border-style: solid',
              class: 'mly-w-full [text-align:revert-layer]',
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
        tag: 'table[data-type="section"]',
      },
    ];
  },
});
