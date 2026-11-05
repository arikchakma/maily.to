import {
  DEFAULT_FONT_FAMILIES,
  MAILY_EXTENSION_TYPES,
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import type { FontFamilyItem, InlineStyle } from '@maily-to/shared';
import { Extension } from '@tiptap/core';

import {
  getColumnsStyle,
  getColumnStyle,
  getElementStyle,
  getInlineImageStyle,
  getMarkStyle,
  getWrapperStyle,
  setStyleDeclarations,
} from '~/utils/style';

const WRAPPER_TYPES: string[] = [
  MAILY_NODE_TYPES.BODY,
  MAILY_NODE_TYPES.CONTAINER,
  MAILY_NODE_TYPES.SECTION,
];

export const STYLE_SUPPORTED_TYPES: string[] = [
  ...WRAPPER_TYPES,
  MAILY_NODE_TYPES.COLUMNS,
  MAILY_NODE_TYPES.COLUMN,
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.IMAGE,
  MAILY_NODE_TYPES.INLINE_IMAGE,
  MAILY_NODE_TYPES.INLINE_SPAN,
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.FOOTER,
  MAILY_NODE_TYPES.BLOCKQUOTE,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.LIST_ITEM,
  MAILY_NODE_TYPES.TABLE,
  MAILY_NODE_TYPES.TABLE_ROW,
  MAILY_NODE_TYPES.TABLE_CELL,
  MAILY_NODE_TYPES.TABLE_HEADER,
];

const STYLE_SUPPORTED_MARK_TYPES: string[] = [
  MAILY_MARK_TYPES.BOLD,
  MAILY_MARK_TYPES.ITALIC,
  MAILY_MARK_TYPES.STRIKE,
  MAILY_MARK_TYPES.UNDERLINE,
  MAILY_MARK_TYPES.LINK,
  MAILY_MARK_TYPES.CODE,
];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    style: {
      updateNodeStyle: (
        typeOrName: string,
        declarations: InlineStyle | Record<string, string | null | undefined>
      ) => ReturnType;
    };
  }
}

export type StyleOptions = {
  fontFamilies: FontFamilyItem[];
  markTypes: string[];
  types: string[];
};

function getStyleAttribute(parseHTML: (element: HTMLElement) => string | null) {
  return {
    style: {
      default: null,
      parseHTML,
      renderHTML: (attributes: Record<string, unknown>) =>
        typeof attributes.style === 'string' ? { style: attributes.style } : {},
    },
  };
}

export const StyleExtension = Extension.create<StyleOptions>({
  name: MAILY_EXTENSION_TYPES.STYLE,

  addOptions() {
    return {
      fontFamilies: DEFAULT_FONT_FAMILIES,
      markTypes: STYLE_SUPPORTED_MARK_TYPES,
      types: STYLE_SUPPORTED_TYPES,
    };
  },

  addCommands() {
    return {
      updateNodeStyle:
        (typeOrName, declarations) =>
        ({ commands, editor }) =>
          commands.updateAttributes(typeOrName, {
            style: setStyleDeclarations(
              editor.getAttributes(typeOrName).style as string | null,
              declarations
            ),
          }),
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types.filter(
          (type) =>
            !WRAPPER_TYPES.includes(type) &&
            type !== MAILY_NODE_TYPES.COLUMNS &&
            type !== MAILY_NODE_TYPES.COLUMN &&
            type !== MAILY_NODE_TYPES.INLINE_IMAGE
        ),
        attributes: getStyleAttribute(getElementStyle),
      },
      {
        types: [MAILY_NODE_TYPES.INLINE_IMAGE],
        attributes: getStyleAttribute(getInlineImageStyle),
      },
      {
        types: [MAILY_NODE_TYPES.COLUMNS],
        attributes: getStyleAttribute((element) =>
          getColumnsStyle(getElementStyle(element))
        ),
      },
      {
        types: [MAILY_NODE_TYPES.COLUMN],
        attributes: getStyleAttribute((element) =>
          getColumnStyle(getElementStyle(element))
        ),
      },
      {
        types: this.options.types.filter((type) =>
          WRAPPER_TYPES.includes(type)
        ),
        attributes: getStyleAttribute(getWrapperStyle),
      },
      {
        types: this.options.markTypes,
        attributes: getStyleAttribute((element) =>
          getMarkStyle(element.getAttribute('style'))
        ),
      },
    ];
  },
});
