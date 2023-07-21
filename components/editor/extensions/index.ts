import { InputRule } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import TiptapLink from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

import { HorizontalRule } from '@/components/editor/extensions/horizontal-rule';

import { ButtonExtension } from '../nodes/button-extension';
import { Footer } from '../nodes/footer';
import { TiptapLogoExtension } from '../nodes/logo';
import { Spacer } from '../nodes/spacer';
import { Variable } from '../nodes/variable';
import { SlashCommand } from './slash-command';

export const TiptapExtensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  ListItem,
  Image,
  Dropcursor.configure({
    color: '#555',
    width: 3,
  }),
  TiptapLogoExtension,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  TextAlign.configure({ types: [Paragraph.name, Heading.name] }),
  Heading.extend({
    levels: [1, 2, 3],
  }),
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
  History,
  Spacer,
  Gapcursor,
  HardBreak,
  Footer,
  Variable,
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
