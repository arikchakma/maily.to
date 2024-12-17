import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TiptapLink from '@tiptap/extension-link';
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

import { HorizontalRule } from './horizontal-rule';
import { Footer } from '../nodes/footer';
import { Spacer } from '../nodes/spacer';
import { MailyContextType } from '../provider';
import { LinkCardExtension } from './link-card';
import { ColumnsExtension } from '../nodes/columns/columns';
import { ColumnExtension } from '../nodes/columns/column';
import { SectionExtension } from '../nodes/section/section';
import { ForExtension } from '../nodes/for/for';
import { ButtonExtension } from '../nodes/button/button';
import { VariableExtension } from '../nodes/variable/variable';
import { getVariableSuggestions } from '../nodes/variable/variable-suggestions';
import { SlashCommand } from './slash-command/slash-command';
import { getSlashCommandSuggestions } from './slash-command/slash-command-view';
import { LogoExtension } from '../nodes/logo/logo';
import { ImageExtension } from '../nodes/image/image';

type ExtensionsProps = Partial<MailyContextType> & {};

export function extensions(props: ExtensionsProps) {
  const { variables, blocks, variableTriggerCharacter } = props;

  return [
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
    TextAlign.configure({ types: [Paragraph.name, Heading.name, Footer.name] }),
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
    SlashCommand.configure({
      suggestion: getSlashCommandSuggestions(blocks),
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: 'mly-no-underline',
      },
      openOnClick: false,
    }),
    ImageExtension,
    LinkCardExtension,
    Focus,
    SectionExtension,
    ForExtension,
    Dropcursor.configure({
      color: '#555',
      width: 3,
      class: 'ProseMirror-dropcursor',
    }),
    ButtonExtension,
    VariableExtension.configure({
      suggestion: getVariableSuggestions(variables, variableTriggerCharacter),
    }),
  ];
}
