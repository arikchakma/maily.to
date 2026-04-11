import {
  DATA_NODE_TYPE_KEY,
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { AnyExtension } from '@tiptap/core';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { UniqueID } from '@tiptap/extension-unique-id';
import {
  Dropcursor,
  Focus,
  Gapcursor,
  Selection,
  UndoRedo,
} from '@tiptap/extensions';
import type { JSONContent, UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import type { DependencyList } from 'react';

import { BlockquoteExtension } from '~/extensions/blockquote/blockquote';
import { ButtonExtension } from '~/extensions/button/button';
import { ColumnExtension, ColumnsExtension } from '~/extensions/columns';
import { Document } from '~/extensions/document/document';
import { FontStyleExtension } from '~/extensions/font-style/font-style';
import { FooterExtension } from '~/extensions/footer/footer';
import { HorizontalRuleExtension } from '~/extensions/horizontal-rule/horizontal-rule';
import { HtmlCodeBlockExtension } from '~/extensions/html-code-block/html-code-block';
import { InlineImageExtension } from '~/extensions/inline-image/inline-image';
import { PlaceholderExtension } from '~/extensions/placeholder/placeholder';
import { RepeatExtension } from '~/extensions/repeat/repeat';
import { ResizableImageExtension } from '~/extensions/resizable-image/resizable-image';
import { SectionExtension } from '~/extensions/section/section';
import { SlashCommandExtension } from '~/extensions/slash-command/slash-command';
import { SpacerExtension } from '~/extensions/spacer/spacer';
import { VariableExtension } from '~/extensions/variable/variable';
import { VisibilityExtension } from '~/extensions/visibility/visibility';
import { mergeExtensions } from '~/utils/extensions';
import { getInitialEditorContent } from '~/utils/initial-content';

type UseMailyEditorOptions = {
  content?: string | JSONContent;
  extensions?: AnyExtension[];
} & Omit<UseEditorOptions, 'content' | 'extensions'>;

const DEFAULT_EXTENSIONS: AnyExtension[] = [
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.PARAGRAPH,
    },
  }),
  Text,
  PlaceholderExtension,
  HardBreak,
  UndoRedo,
  Bold,
  Italic,
  Strike,
  Underline,
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HEADING,
    },
  }),
  FontStyleExtension,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_MARK_TYPES.LINK,
    },
  }),
  Dropcursor.configure({
    width: 2,
    class: 'mly:text-gray-300 mly:rounded',
  }),
  Gapcursor,
  Typography,
  Selection,
  Focus,
  UniqueID.configure({
    types: [
      MAILY_NODE_TYPES.HEADING,
      MAILY_NODE_TYPES.PARAGRAPH,
      MAILY_NODE_TYPES.IMAGE,
      MAILY_NODE_TYPES.SPACER,
      MAILY_NODE_TYPES.SECTION,
      MAILY_NODE_TYPES.REPEAT,
      MAILY_NODE_TYPES.COLUMNS,
      MAILY_NODE_TYPES.COLUMN,
      MAILY_NODE_TYPES.BULLET_LIST,
      MAILY_NODE_TYPES.ORDERED_LIST,
      MAILY_NODE_TYPES.LIST_ITEM,
      MAILY_NODE_TYPES.HORIZONTAL_RULE,
      MAILY_NODE_TYPES.BUTTON,
      MAILY_NODE_TYPES.HTML_CODE_BLOCK,
      MAILY_NODE_TYPES.BLOCKQUOTE,
      MAILY_NODE_TYPES.FOOTER,
    ],
  }),
  BulletList.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.BULLET_LIST,
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.LIST_ITEM,
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.ORDERED_LIST,
    },
  }),
  Code.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_MARK_TYPES.CODE,
    },
  }),
  TextAlign.configure({
    types: [
      MAILY_NODE_TYPES.HEADING,
      MAILY_NODE_TYPES.PARAGRAPH,
      MAILY_NODE_TYPES.FOOTER,
    ],
    alignments: [
      TEXT_ALIGNMENTS.LEFT,
      TEXT_ALIGNMENTS.CENTER,
      TEXT_ALIGNMENTS.RIGHT,
    ],
  }),
  TextStyleKit.configure({
    fontFamily: false,
    fontSize: false,
    lineHeight: false,
    backgroundColor: false,
  }),
  ResizableImageExtension,
  InlineImageExtension,
  VariableExtension,
  SlashCommandExtension,
  Highlight.configure({
    multicolor: true,
  }),
  HorizontalRuleExtension,
  BlockquoteExtension,
  SpacerExtension,
  SectionExtension,
  RepeatExtension,
  ColumnsExtension,
  ColumnExtension,
  ButtonExtension,
  HtmlCodeBlockExtension,
  FooterExtension,
  VisibilityExtension,
];

/**
 * Creates a Tiptap editor instance preconfigured with all Maily
 * extensions and node types. User extensions override defaults by name.
 */
export const useMailyEditor = (
  options: UseMailyEditorOptions,
  dependencies?: DependencyList
) => {
  const { content, extensions: userExtensions, ...rest } = options;

  const extensions = userExtensions
    ? mergeExtensions(DEFAULT_EXTENSIONS, userExtensions)
    : DEFAULT_EXTENSIONS;

  return useEditor(
    {
      ...rest,
      extensions,
      content: getInitialEditorContent(content),
    },
    dependencies
  );
};
