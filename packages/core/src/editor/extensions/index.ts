import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TiptapLink from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

import { HorizontalRule } from './horizontal-rule';
import { ButtonExtension } from './button-extension';
import { Footer } from '../nodes/footer';
import { TiptapLogoExtension } from '../nodes/logo';
import { Spacer } from '../nodes/spacer';
import { getVariableSuggestions } from '../nodes/variable';
import { SlashCommand } from './slash-command';
import { Variable } from './variable-extension';

type ExtensionsProps = {
  variables?: string[];
};

export function extensions(props: ExtensionsProps) {
  const { variables } = props;

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      dropcursor: {
        color: '#555',
        width: 3,
      },
      horizontalRule: false,
      blockquote: {
        HTMLAttributes: {
          class:
            'mly-not-prose mly-border-l-4 mly-border-gray-300 mly-pl-4 mly-mt-4 mly-mb-4',
        },
      },
    }),
    Image,
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
    SlashCommand,
    TiptapLink.configure({
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
      openOnClick: false,
    }),
    ButtonExtension,
  ];
}
