import type { AllowedTextAlignment } from './alignment';
import type { BorderStyleConfig } from './border';
import type { AllowedButtonKind } from './button-kind';
import type { AllowedFieldMode } from './field-mode';
import type { FontStyleAttributes } from './font-style';
import type { AllowedHtmlCodeBlockTab } from './html-code-block';
import type { MarginStyleConfig } from './margin';
import type { AnyMailyMark } from './mark';
import type { PaddingStyleConfig } from './padding';
import type { TextDirection } from './text-direction';
import type { VisibilityRule } from './visibility';

/**
 * Registry of all document node type strings. These map 1:1 to
 * Tiptap extension names and are used as discriminators in the
 * document JSON.
 */
export const MAILY_NODE_TYPES = {
  DOCUMENT: 'doc',
  PARAGRAPH: 'paragraph',
  TEXT: 'text',
  HEADING: 'heading',
  VARIABLE: 'variable',
  IMAGE: 'image',
  SPACER: 'spacer',
  SECTION: 'section',
  COLUMNS: 'columns',
  COLUMN: 'column',
  BULLET_LIST: 'bulletList',
  ORDERED_LIST: 'orderedList',
  LIST_ITEM: 'listItem',
  HORIZONTAL_RULE: 'horizontalRule',
  BUTTON: 'button',
  REPEAT: 'repeat',
  HTML_CODE_BLOCK: 'htmlCodeBlock',
  BLOCKQUOTE: 'blockquote',
  HARD_BREAK: 'hardBreak',
  FOOTER: 'footer',
  INLINE_IMAGE: 'inlineImage',
  LINK_CARD: 'linkCard',
} as const;

/**
 * Tiptap extension types that attach attributes to nodes but are
 * not document nodes themselves (e.g. fontStyle, visibility).
 */
export const MAILY_EXTENSION_TYPES = {
  FONT_STYLE: 'fontStyle',
  VISIBILITY: 'visibility',
} as const;

export const allowedNodeTypes = Object.values(MAILY_NODE_TYPES);

export type MailyNodeType =
  (typeof MAILY_NODE_TYPES)[keyof typeof MAILY_NODE_TYPES];

/**
 * Global attributes mixed into every node by Tiptap extensions:
 * text direction, unique id, and conditional visibility.
 */
export type WithExtraAttrs = {
  dir?: TextDirection | null;
  id?: string | null;
  visibilityRule?: VisibilityRule | null;
};

/**
 * Base shape shared by all document nodes. Individual node types
 * narrow the type field, add typed attrs, and constrain content.
 */
export type BaseMailyNode = {
  type: MailyNodeType;
  attrs?: Record<string, any> & WithExtraAttrs;
  content?: AnyMailyNode[];
  marks?: AnyMailyMark[];
  text?: string;
};

/** Document */
export type DocumentAttributes = {
  version: number;
};

export type DocumentNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.DOCUMENT;
  attrs: DocumentAttributes;
  content: BaseMailyNode[];
};

/** Paragraph */
export type ParagraphAttributes = {
  id: string;
  textAlign: AllowedTextAlignment;
} & FontStyleAttributes;

export type ParagraphNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.PARAGRAPH;
  attrs: ParagraphAttributes;
};

/** Text */
export type TextNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.TEXT;
  text: string;
};

/** Heading */
export type HeadingLevel = 1 | 2 | 3;
export type HeadingAttributes = {
  id: string;
  level: HeadingLevel;
} & FontStyleAttributes;

export type HeadingNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.HEADING;
  attrs: HeadingAttributes;
};

/**
 * Variable
 * Attributes for a template variable node. The id and label must not
 * contain `|` characters — that delimiter is used when serializing
 * variable data to plain text (see serializeVariableToText).
 */
export type VariableAttributes = {
  /** Stored as `data-id`. Identifies which variable this node represents. */
  id: string | null;
  /** Stored as `data-label`. Display text shown in the editor instead of the id. */
  label?: string | null;
  /** Stored as `data-fallback`. Used when the variable has no value at render time. */
  fallback?: string | null;
  required?: boolean;
  hideDefaultValue?: boolean;
  /** The character that opens the variable suggestion popup (e.g. `@`). */
  variableSuggestionChar?: string;
};

export type VariableNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.VARIABLE;
  attrs: VariableAttributes;
  content: never;
};

/** Image */
export type ImageAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width: string;

  align: AllowedTextAlignment;
  externalLink: string | null;
} & BorderStyleConfig;

export type ImageNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.IMAGE;
  attrs: ImageAttributes;
  content: never;
};

/** Spacer */
export type SpacerAttributes = {
  height: number;
  heightMode: AllowedFieldMode;
};

export type SpacerNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.SPACER;
  attrs: SpacerAttributes;
  content: never;
};

/** Section */
export type SectionAttributes = {
  backgroundColor: string;
  align: AllowedTextAlignment;
} & BorderStyleConfig &
  PaddingStyleConfig &
  MarginStyleConfig;

export type SectionNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.SECTION;
  attrs: SectionAttributes;
  content: AnyMailyNode[];
};

/** Bullet List */
export type BulletListAttributes = {
  id: string;
};

export type BulletListNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.BULLET_LIST;
  attrs: BulletListAttributes;
  content: AnyMailyNode[];
};

/** Ordered List */
export type OrderedListAttributes = {
  id: string;
};

export type OrderedListNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.ORDERED_LIST;
  attrs: OrderedListAttributes;
  content: AnyMailyNode[];
};

/** List Item */
export type ListItemAttributes = {
  id: string;
};

export type ListItemNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.LIST_ITEM;
  attrs: ListItemAttributes;
  content: AnyMailyNode[];
};

/** Blockquote */
export type BlockquoteAttributes = {
  id: string;
} & FontStyleAttributes;

export type BlockquoteNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.BLOCKQUOTE;
  attrs: BlockquoteAttributes;
  content: AnyMailyNode[];
};

/** Horizontal Rule */
export type HorizontalRuleAttributes = {
  id: string;
};

export type HorizontalRuleNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.HORIZONTAL_RULE;
  attrs: HorizontalRuleAttributes;
  content: never;
};

/** Button */
export type ButtonAttributes = {
  url: string;
  kind: AllowedButtonKind;
  alignment: AllowedTextAlignment | null;
  backgroundColor: string | null;
  color: string | null;
  paddingMode: AllowedFieldMode;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
} & BorderStyleConfig &
  FontStyleAttributes;

export type ButtonNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.BUTTON;
  attrs: ButtonAttributes;
  content: AnyMailyNode[];
};

/** HTML Code Block */
export type HtmlCodeBlockAttributes = {
  activeTab: AllowedHtmlCodeBlockTab;
  language: string;
};

export type HtmlCodeBlockNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.HTML_CODE_BLOCK;
  attrs: HtmlCodeBlockAttributes;
  content: AnyMailyNode[];
};

/** Repeat */
export type RepeatAttributes = {
  each: string;
};

export type RepeatNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.REPEAT;
  attrs: RepeatAttributes;
  content: AnyMailyNode[];
};

/** Columns (container for multiple columns) */
export type ColumnsAttributes = {
  columnCount: number;
  gap: number;
};

export type ColumnsNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.COLUMNS;
  attrs: ColumnsAttributes;
  content: ColumnNode[];
};

/** Column (individual column within columns container) */
export type ColumnAttributes = {
  width: number | null; // null = auto (equal space), number = percentage
  verticalAlign: 'top' | 'middle' | 'bottom';
};

export type ColumnNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.COLUMN;
  attrs: ColumnAttributes;
  content: AnyMailyNode[];
};

/** Hard Break */
export type HardBreakNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.HARD_BREAK;
  content: never;
};

/** Footer */
export type FooterAttributes = {
  id: string;
  textAlign: AllowedTextAlignment;
} & FontStyleAttributes;

export type FooterNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.FOOTER;
  attrs: FooterAttributes;
};

/** Inline Image */
export type InlineImageAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width: number;
  height: number;
  externalLink: string | null;
};

export type InlineImageNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.INLINE_IMAGE;
  attrs: InlineImageAttributes;
  content: never;
};

/** Link Card */
export type LinkCardAttributes = {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
  image: string;
  subTitle: string;
  badgeText: string;
};

export type LinkCardNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.LINK_CARD;
  attrs: LinkCardAttributes;
  content: never;
};

export type AnyMailyNode =
  | DocumentNode
  | ParagraphNode
  | TextNode
  | HeadingNode
  | VariableNode
  | ImageNode
  | SpacerNode
  | SectionNode
  | RepeatNode
  | ColumnsNode
  | ColumnNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | HorizontalRuleNode
  | ButtonNode
  | HtmlCodeBlockNode
  | BlockquoteNode
  | HardBreakNode
  | FooterNode
  | InlineImageNode
  | LinkCardNode;
