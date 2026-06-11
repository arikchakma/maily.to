import type { FontFamilyItem, FontStyleAttributes } from '@maily-to/shared';
import {
  DEFAULT_FONT_FAMILIES,
  MAILY_EXTENSION_TYPES,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Extension } from '@tiptap/core';

import { parseFontFamilyToArray } from '../../utils/style';

export const FONT_STYLE_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.BLOCKQUOTE,
  MAILY_NODE_TYPES.FOOTER,
];

export type FontStyleOptions = {
  types: string[];
  fontFamilies: FontFamilyItem[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontStyle: {
      setFontStyle: (attrs: Partial<FontStyleAttributes>) => ReturnType;
      unsetFontStyle: () => ReturnType;
    };
  }
}

export const FontStyleExtension = Extension.create<FontStyleOptions>({
  name: MAILY_EXTENSION_TYPES.FONT_STYLE,

  addOptions() {
    return {
      types: FONT_STYLE_SUPPORTED_TYPES,
      fontFamilies: DEFAULT_FONT_FAMILIES,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => {
              const dataAttr = element.getAttribute('data-font-family');
              if (dataAttr) {
                return dataAttr;
              }

              const fontFamily = element.style.fontFamily;
              if (!fontFamily) {
                return null;
              }

              const fonts = parseFontFamilyToArray(fontFamily);
              return fonts[0] ?? null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontFamily && !attributes.fontFallback) {
                return {};
              }

              const parts = [
                attributes.fontFamily,
                attributes.fontFallback,
              ].filter(Boolean);

              return {
                'data-font-family': attributes.fontFamily || undefined,
                style: `font-family: ${parts.join(', ')}`,
              };
            },
          },
          fontFallback: {
            default: null,
            parseHTML: (element) => {
              const dataAttr = element.getAttribute('data-font-fallback');
              if (dataAttr) {
                return dataAttr;
              }

              const fontFamily = element.style.fontFamily;
              if (!fontFamily) {
                return null;
              }

              const fonts = parseFontFamilyToArray(fontFamily);
              return fonts.length > 1 ? fonts[fonts.length - 1] : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontFallback) {
                return {};
              }

              return {
                'data-font-fallback': attributes.fontFallback,
              };
            },
          },
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const fontSize = element.style.fontSize;
              if (!fontSize) {
                return null;
              }

              return parseFloat(fontSize);
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
          fontWeight: {
            default: null,
            parseHTML: (element) => {
              const fontWeight = element.style.fontWeight;
              if (!fontWeight) {
                return null;
              }
              return parseInt(fontWeight, 10);
            },
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) {
                return {};
              }
              return {
                style: `font-weight: ${attributes.fontWeight}`,
              };
            },
          },
          lineHeight: {
            default: null,
            parseHTML: (element) => {
              const lineHeight = element.style.lineHeight;
              if (!lineHeight) {
                return null;
              }

              return parseFloat(lineHeight);
            },
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
          fontStyle: {
            default: null,
            parseHTML: (element) => {
              const fontStyle = element.style.fontStyle;
              return fontStyle || null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontStyle) {
                return {};
              }
              return {
                style: `font-style: ${attributes.fontStyle}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontStyle:
        (attrs: Partial<FontStyleAttributes>) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isText) {
                return;
              }

              if (!this.options.types.includes(node.type.name)) {
                return;
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
            });
          }

          return true;
        },

      unsetFontStyle:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isText) {
                return;
              }

              if (!this.options.types.includes(node.type.name)) {
                return;
              }

              const newAttrs = { ...node.attrs };
              delete newAttrs.fontFamily;
              delete newAttrs.fontFallback;
              delete newAttrs.fontSize;
              delete newAttrs.fontWeight;
              delete newAttrs.lineHeight;
              delete newAttrs.fontStyle;

              tr.setNodeMarkup(pos, undefined, newAttrs);
            });
          }

          return true;
        },
    };
  },
});
