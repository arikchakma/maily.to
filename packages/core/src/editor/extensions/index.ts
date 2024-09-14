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

import { HorizontalRule } from './horizontal-rule';
import { ButtonExtension } from './button-extension';
import { Footer } from '../nodes/footer';
import { TiptapLogoExtension } from '../nodes/logo';
import { Spacer } from '../nodes/spacer';
import { getVariableSuggestions } from '../nodes/variable';
import { getSlashCommandSuggestions, SlashCommand } from './slash-command';
import { Variable } from './variable-extension';
import { ResizableImageExtension } from './image-resize';
import { MailyContextType } from '../provider';
import { LinkCardExtension } from './link-card';
import { Columns } from './columns/columns';
import { Column } from './columns/column';
import { Section } from './section/section';

type ExtensionsProps = Partial<MailyContextType> & {};

export function extensions(props: ExtensionsProps) {
  const { variables, slashCommands } = props;

  return [
    Document.extend({
      content: '(block|columns)+',
    }),
    Columns,
    Column,
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      dropcursor: {
        color: '#555',
        width: 3,
      },
      code: {
        HTMLAttributes: {
          class:
            'mly-px-1 mly-py-0.5 mly-bg-[#efefef] mly-text-sm mly-rounded-md mly-tracking-normal mly-font-normal',
        },
      },
      horizontalRule: false,
      blockquote: {
        HTMLAttributes: {
          class:
            'mly-not-prose mly-border-l-4 mly-border-gray-300 mly-pl-4 mly-mt-4 mly-mb-4',
        },
      },
      document: false,
    }),
    Underline,
    TiptapLogoExtension,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    TextAlign.configure({ types: [Paragraph.name, Heading.name, Footer.name] }),
    HorizontalRule,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}`;
        } else if (
          node.type.name === 'columns' ||
          node.type.name === 'column' ||
          node.type.name === 'section'
        ) {
          return '';
        }

        return 'Write something or / to see commands';
      },
      includeChildren: true,
    }),
    Spacer,
    Footer,
    Variable.configure({
      suggestion: getVariableSuggestions(variables),
    }),
    SlashCommand.configure({
      suggestion: getSlashCommandSuggestions(slashCommands),
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
      openOnClick: false,
    }),
    ButtonExtension,
    ResizableImageExtension,
    LinkCardExtension,
    Focus,
    Section,
  ];
}
