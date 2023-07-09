import { InputRule } from "@tiptap/core";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Underline from "@tiptap/extension-underline";
import { History } from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import { TiptapLogoExtension } from "../nodes/logo";
import { Spacer } from "../nodes/spacer";
import { Footer } from "../nodes/footer";
import { Variable } from "../nodes/variable";
import { SlashCommand } from "./slash-command";
import TiptapLink from "@tiptap/extension-link";
import { HorizontalRule } from "@/components/editor/extensions/horizontal-rule";

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
    color: "#555",
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
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Write something ..";
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
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    },
    openOnClick: false,
  }),
];
