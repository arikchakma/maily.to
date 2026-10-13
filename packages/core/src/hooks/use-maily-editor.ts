import {
  DATA_NODE_TYPE_KEY,
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import type { AnyExtension } from '@tiptap/core';
import { Code } from '@tiptap/extension-code';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { TextStyle, TextStyleKit } from '@tiptap/extension-text-style';
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
import type { UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import type { DependencyList } from 'react';

import { BlockquoteExtension } from '~/extensions/blockquote/blockquote';
import { BodyExtension } from '~/extensions/body/body';
import { BoldExtension } from '~/extensions/bold/bold';
import { ButtonExtension } from '~/extensions/button/button';
import { ColumnExtension } from '~/extensions/columns/column';
import { ColumnsExtension } from '~/extensions/columns/columns';
import { ContainerExtension } from '~/extensions/container/container';
import { Document } from '~/extensions/document/document';
import { FooterExtension } from '~/extensions/footer/footer';
import { HorizontalRuleExtension } from '~/extensions/horizontal-rule/horizontal-rule';
import { HtmlCodeBlockExtension } from '~/extensions/html-code-block/html-code-block';
import { ImageUploadExtension } from '~/extensions/image-upload/image-upload';
import { ImageExtension } from '~/extensions/image/image';
import { InlineImageExtension } from '~/extensions/inline-image/inline-image';
import { InlineSpanExtension } from '~/extensions/inline-span/inline-span';
import { ParagraphExtension } from '~/extensions/paragraph/paragraph';
import { PlaceholderExtension } from '~/extensions/placeholder/placeholder';
import { RepeatExtension } from '~/extensions/repeat/repeat';
import { SectionExtension } from '~/extensions/section/section';
import { SlashCommandExtension } from '~/extensions/slash-command/slash-command';
import { SpacerExtension } from '~/extensions/spacer/spacer';
import { SpanExtension } from '~/extensions/span/span';
import { StyleExtension } from '~/extensions/style/style';
import { TableExtension } from '~/extensions/table/table';
import { TableCellExtension } from '~/extensions/table/table-cell';
import { TableHeaderExtension } from '~/extensions/table/table-header';
import { TableRowExtension } from '~/extensions/table/table-row';
import { VariableExtension } from '~/extensions/variable/variable';
import { VisibilityExtension } from '~/extensions/visibility/visibility';
import { mergeExtensions } from '~/utils/extensions';
import { getNormalizedHtml } from '~/utils/html';
import { pasteHtmlSource } from '~/utils/paste';

type UseMailyEditorOptions = {
  extensions?: AnyExtension[];
} & Omit<UseEditorOptions, 'extensions'>;

const DEFAULT_EXTENSIONS: AnyExtension[] = [
  Document,
  BodyExtension,
  ContainerExtension,
  SectionExtension,
  RepeatExtension,
  ColumnsExtension,
  ColumnExtension,
  ParagraphExtension,
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.HEADING,
    },
  }),
  Text,
  PlaceholderExtension,
  HardBreak,
  BoldExtension,
  Italic,
  Strike,
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_MARK_TYPES.LINK,
    },
  }),
  Code.configure({
    HTMLAttributes: {
      [DATA_NODE_TYPE_KEY]: MAILY_MARK_TYPES.CODE,
    },
  }),
  TextStyleKit.configure({
    fontFamily: false,
    fontSize: false,
    lineHeight: false,
    backgroundColor: false,
    textStyle: false,
  }),
  // Tiptap's own rule claims every `span[style]`, which leaves an empty text
  // style mark on spans that only carry declarations other marks own.
  TextStyle.extend({
    parseHTML() {
      return [
        {
          tag: 'span[style]',
          consuming: false,
          getAttrs: (element) => (element.style.color ? {} : false),
        },
      ];
    },
  }),
  Highlight.configure({
    multicolor: true,
  }),
  SpanExtension,
  InlineSpanExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ImageUploadExtension,
  InlineImageExtension,
  SpacerExtension,
  ButtonExtension,
  FooterExtension,
  BlockquoteExtension,
  HtmlCodeBlockExtension,
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
  TableExtension,
  TableRowExtension,
  TableCellExtension,
  TableHeaderExtension,
  StyleExtension,
  VisibilityExtension,
  VariableExtension,
  SlashCommandExtension,
  Typography,
  UndoRedo,
  Dropcursor.configure({ color: '#d1d5dc', width: 2 }),
  Gapcursor,
  Selection,
  Focus,
  UniqueID.configure({
    types: [
      MAILY_NODE_TYPES.HEADING,
      MAILY_NODE_TYPES.PARAGRAPH,
      MAILY_NODE_TYPES.SECTION,
      MAILY_NODE_TYPES.REPEAT,
      MAILY_NODE_TYPES.COLUMNS,
      MAILY_NODE_TYPES.COLUMN,
      MAILY_NODE_TYPES.BULLET_LIST,
      MAILY_NODE_TYPES.ORDERED_LIST,
      MAILY_NODE_TYPES.LIST_ITEM,
      MAILY_NODE_TYPES.HORIZONTAL_RULE,
      MAILY_NODE_TYPES.BLOCKQUOTE,
    ],
  }),
];

export function useMailyEditor(
  options: UseMailyEditorOptions,
  dependencies?: DependencyList
) {
  const { content, editorProps, extensions: userExtensions, ...rest } = options;
  const extensions = userExtensions
    ? mergeExtensions(DEFAULT_EXTENSIONS, userExtensions)
    : DEFAULT_EXTENSIONS;

  return useEditor(
    {
      enableContentCheck: typeof content !== 'string',
      onContentError: ({ error }) => {
        console.error(error);
      },
      ...rest,
      content:
        typeof content === 'string' ? getNormalizedHtml(content) : content,
      editorProps: {
        ...editorProps,
        // Tiptap adds the textbox role only at mount. A re-render replaces
        // these attributes, so the role must stay here too.
        attributes: (state) => ({
          role: 'textbox',
          spellcheck: 'false',
          ...(typeof editorProps?.attributes === 'function'
            ? editorProps.attributes(state)
            : editorProps?.attributes),
        }),
        handlePaste: (view, event, slice) => {
          return (
            pasteHtmlSource({ event, view }) ||
            (editorProps?.handlePaste?.(view, event, slice) ?? false)
          );
        },
        transformPastedHTML: (html, view) => {
          const normalized = getNormalizedHtml(html);

          return (
            editorProps?.transformPastedHTML?.(normalized, view) ?? normalized
          );
        },
      },
      extensions,
    },
    dependencies
  );
}
