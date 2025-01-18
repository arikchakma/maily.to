import { AnyExtension, Extension } from '@tiptap/core';
import { VariableExtension, VariableOptions } from '../nodes/variable/variable';
import { SlashCommandExtension } from './slash-command/slash-command';

import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';

import { Color } from './color';
import { HorizontalRule } from './horizontal-rule';
import { Footer } from '../nodes/footer';
import { Spacer } from '../nodes/spacer';
import { LinkCardExtension, LinkCardOptions } from './link-card';
import { ColumnsExtension } from '../nodes/columns/columns';
import { ColumnExtension } from '../nodes/columns/column';
import { SectionExtension } from '../nodes/section/section';
import { ForExtension } from '../nodes/for/for';
import { ButtonExtension } from '../nodes/button/button';
import { LogoExtension } from '../nodes/logo/logo';
import { ImageExtension } from '../nodes/image/image';
import { LinkExtension } from '../nodes/link';
import { BlockItem } from '@/blocks';

export type MailyKitOptions = {
  variable: Partial<VariableOptions> | false;
  linkCard: Partial<LinkCardOptions> | false;
};

export const MailyKit = Extension.create<MailyKitOptions>({
  name: 'maily-kit',

  addExtensions() {
    const extensions: AnyExtension[] = [
      Document.extend({
        content: '(block|columns)+',
      }),
      ColumnsExtension,
      ColumnExtension,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'mly-relative',
          },
        },
        code: {
          HTMLAttributes: {
            class:
              'mly-px-1 mly-relative mly-py-0.5 mly-bg-[#efefef] mly-text-sm mly-rounded-md mly-tracking-normal mly-font-normal',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              'mly-not-prose mly-border-l-4 mly-border-gray-300 mly-pl-4 mly-mt-4 mly-mb-4 mly-relative',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mly-relative',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'mly-relative',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'mly-relative',
          },
        },
        horizontalRule: false,
        dropcursor: false,
        document: false,
      }),
      Underline,
      LogoExtension,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      TextAlign.configure({
        types: [Paragraph.name, Heading.name, Footer.name],
      }),
      HorizontalRule,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          } else if (
            [
              'columns',
              'column',
              'section',
              'for',
              'show',
              'blockquote',
            ].includes(node.type.name)
          ) {
            return '';
          }

          return 'Write something or / to see commands';
        },
        includeChildren: true,
      }),
      Spacer,
      Footer,
      LinkExtension.configure({
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
          class: 'mly-no-underline',
        },
        openOnClick: false,
      }),
      ImageExtension,
      Focus,
      SectionExtension,
      ForExtension,
      Dropcursor.configure({
        color: '#555',
        width: 3,
        class: 'ProseMirror-dropcursor',
      }),
      ButtonExtension,
    ];

    if (this.options.variable !== false) {
      extensions.push(VariableExtension.configure(this.options.variable));
    }

    if (this.options.linkCard !== false) {
      extensions.push(LinkCardExtension.configure(this.options.linkCard));
    }

    return extensions;
  },
});
