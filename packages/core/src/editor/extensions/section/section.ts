import { updateAttributes } from '@/editor/utils/update-attribute';
import { mergeAttributes, Node } from '@tiptap/core';

export const DEFAULT_SECTION_BACKGROUND_COLOR = '#f1f1f1';
export const DEFAULT_SECTION_BORDER_RADIUS = 0;
export const DEFAULT_SECTION_PADDING = 5;
export const DEFAULT_SECTION_ALIGN = 'left';

type SectionAttributes = {
  borderRadius: number;
  padding: number;
  backgroundColor: string;
  align: string;
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
        class: 'mly-w-full',
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
