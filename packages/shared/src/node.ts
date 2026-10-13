import type { AllowedTextAlignment } from './alignment';
import type { AllowedButtonKind } from './button';
import type { ColumnWidth } from './column';
import type { TextDirection } from './direction';
import type { AllowedHtmlCodeBlockTab } from './html-code-block';
import type { AnyMailyMark } from './mark';
import type { NodeThemeOptions } from './theme';
import type { WithVisibilityAttrs } from './visibility';

export const MAILY_NODE_TYPES = {
  DOCUMENT: 'doc',
  BODY: 'body',
  CONTAINER: 'container',
  SECTION: 'section',
  COLUMNS: 'columns',
  COLUMN: 'column',
  IMAGE: 'image',
  INLINE_IMAGE: 'inlineImage',
  INLINE_SPAN: 'inlineSpan',
  SPACER: 'spacer',
  BUTTON: 'button',
  FOOTER: 'footer',
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  BLOCKQUOTE: 'blockquote',
  HORIZONTAL_RULE: 'horizontalRule',
  HTML_CODE_BLOCK: 'htmlCodeBlock',
  REPEAT: 'repeat',
  HARD_BREAK: 'hardBreak',
  BULLET_LIST: 'bulletList',
  ORDERED_LIST: 'orderedList',
  LIST_ITEM: 'listItem',
  TEXT: 'text',
  VARIABLE: 'variable',
  TABLE: 'table',
  TABLE_ROW: 'tableRow',
  TABLE_CELL: 'tableCell',
  TABLE_HEADER: 'tableHeader',
  LINK_CARD: 'linkCard',
} as const;

export const MAILY_EXTENSION_TYPES = {
  STYLE: 'style',
  THEME: 'theme',
  VISIBILITY: 'visibility',
} as const;

export const allowedNodeTypes = Object.values(MAILY_NODE_TYPES);

export type MailyNodeType =
  (typeof MAILY_NODE_TYPES)[keyof typeof MAILY_NODE_TYPES];

export type WithExtraAttrs = {
  dir?: TextDirection | null;
};

export type BaseMailyNode = {
  attrs?: WithExtraAttrs & Record<string, unknown>;
  content?: AnyMailyNode[];
  marks?: AnyMailyMark[];
  text?: string;
  type: MailyNodeType;
};

export type DocumentAttributes = WithExtraAttrs & {
  theme?: NodeThemeOptions | null;
  version: number;
};

export type DocumentNode = BaseMailyNode & {
  attrs: DocumentAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.DOCUMENT;
};

export type BodyAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type BodyNode = BaseMailyNode & {
  attrs?: BodyAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.BODY;
};

export type ContainerAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type ContainerNode = BaseMailyNode & {
  attrs?: ContainerAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.CONTAINER;
};

export type SectionAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    style?: string | null;
  };

export type SectionNode = BaseMailyNode & {
  attrs?: SectionAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.SECTION;
};

export type RepeatAttributes = WithVisibilityAttrs & {
  each: string;
};

export type RepeatNode = BaseMailyNode & {
  attrs: RepeatAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.REPEAT;
};

export type ColumnsAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    columnCount: number;
    gap: number;
    style?: string | null;
  };

export type ColumnsNode = BaseMailyNode & {
  attrs: ColumnsAttributes;
  content: ColumnNode[];
  type: typeof MAILY_NODE_TYPES.COLUMNS;
};

export type ColumnAttributes = WithExtraAttrs & {
  verticalAlign: string;
  width: ColumnWidth | null;
  style?: string | null;
};

export type ColumnNode = BaseMailyNode & {
  attrs: ColumnAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.COLUMN;
};

export type ImageAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    align: AllowedTextAlignment;
    alt?: string | null;
    externalLink?: string | null;
    src: string;
    style?: string | null;
    title?: string | null;
    width: string;
  };

export type ImageNode = BaseMailyNode & {
  attrs: ImageAttributes;
  type: typeof MAILY_NODE_TYPES.IMAGE;
};

export type ButtonAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    align: AllowedTextAlignment;
    kind: AllowedButtonKind;
    style?: string | null;
    url: string;
  };

export type ButtonNode = BaseMailyNode & {
  attrs: ButtonAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.BUTTON;
};

export type FooterAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type FooterNode = BaseMailyNode & {
  attrs?: FooterAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.FOOTER;
};

export type InlineImageAttributes = WithExtraAttrs & {
  alt?: string | null;
  externalLink?: string | null;
  height: number;
  src: string;
  style?: string | null;
  title?: string | null;
  width: number;
};

export type InlineImageNode = BaseMailyNode & {
  attrs: InlineImageAttributes;
  type: typeof MAILY_NODE_TYPES.INLINE_IMAGE;
};

export type InlineSpanAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type InlineSpanNode = BaseMailyNode & {
  attrs?: InlineSpanAttributes;
  type: typeof MAILY_NODE_TYPES.INLINE_SPAN;
};

export type SpacerAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    height: number;
    style?: string | null;
  };

export type SpacerNode = BaseMailyNode & {
  attrs: SpacerAttributes;
  type: typeof MAILY_NODE_TYPES.SPACER;
};

export type ParagraphAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    style?: string | null;
  };

export type ParagraphNode = BaseMailyNode & {
  attrs?: ParagraphAttributes;
  type: typeof MAILY_NODE_TYPES.PARAGRAPH;
};

export type HeadingLevel = 1 | 2 | 3;

export type HeadingAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    level: HeadingLevel;
    style?: string | null;
  };

export type HeadingNode = BaseMailyNode & {
  attrs: HeadingAttributes;
  type: typeof MAILY_NODE_TYPES.HEADING;
};

export type BlockquoteAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type BlockquoteNode = BaseMailyNode & {
  attrs?: BlockquoteAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.BLOCKQUOTE;
};

export type HorizontalRuleAttributes = WithVisibilityAttrs & {
  style?: string | null;
};

export type HorizontalRuleNode = BaseMailyNode & {
  attrs?: HorizontalRuleAttributes;
  type: typeof MAILY_NODE_TYPES.HORIZONTAL_RULE;
};

export type HardBreakNode = BaseMailyNode & {
  type: typeof MAILY_NODE_TYPES.HARD_BREAK;
};

export type BulletListAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    style?: string | null;
  };

export type BulletListNode = BaseMailyNode & {
  attrs?: BulletListAttributes;
  content: ListItemNode[];
  type: typeof MAILY_NODE_TYPES.BULLET_LIST;
};

export type OrderedListAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    start?: number;
    style?: string | null;
  };

export type OrderedListNode = BaseMailyNode & {
  attrs?: OrderedListAttributes;
  content: ListItemNode[];
  type: typeof MAILY_NODE_TYPES.ORDERED_LIST;
};

export type ListItemAttributes = WithExtraAttrs & {
  style?: string | null;
};

export type ListItemNode = BaseMailyNode & {
  attrs?: ListItemAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.LIST_ITEM;
};

export type HtmlCodeBlockAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    activeTab: AllowedHtmlCodeBlockTab;
    language: string;
    style?: string | null;
  };

export type HtmlCodeBlockNode = BaseMailyNode & {
  attrs: HtmlCodeBlockAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.HTML_CODE_BLOCK;
};

export type TextNode = BaseMailyNode & {
  marks?: AnyMailyMark[];
  text: string;
  type: typeof MAILY_NODE_TYPES.TEXT;
};

export type VariableAttributes = WithExtraAttrs & {
  fallback?: string | null;
  /** @deprecated Use `isDefaultEditable` instead. */
  hideDefaultValue?: boolean;
  id: string;
  isDefaultEditable?: boolean;
  label?: string | null;
  required?: boolean;
  style?: string | null;
};

export const DEFAULT_VARIABLE_ATTRIBUTES = {
  fallback: null,
  isDefaultEditable: true,
  label: null,
  required: true,
  style: null,
} satisfies Omit<VariableAttributes, 'id'>;

export type VariableNode = BaseMailyNode & {
  attrs: VariableAttributes;
  type: typeof MAILY_NODE_TYPES.VARIABLE;
};

export type TableAttributes = {
  border?: number;
  cellpadding?: number;
  cellspacing?: number;
  responsive: boolean;
  style?: string | null;
};

export type TableNode = BaseMailyNode & {
  attrs: TableAttributes;
  content: TableRowNode[];
  type: typeof MAILY_NODE_TYPES.TABLE;
};

export type TableRowAttributes = {
  style?: string | null;
};

export type TableRowNode = BaseMailyNode & {
  attrs?: TableRowAttributes;
  content: (TableCellNode | TableHeaderNode)[];
  type: typeof MAILY_NODE_TYPES.TABLE_ROW;
};

export type TableCellAttributes = {
  colspan: number;
  colwidth: number[] | null;
  rowspan: number;
  style?: string | null;
};

export type TableCellNode = BaseMailyNode & {
  attrs: TableCellAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.TABLE_CELL;
};

export type TableHeaderAttributes = TableCellAttributes;

export type TableHeaderNode = BaseMailyNode & {
  attrs: TableHeaderAttributes;
  content: AnyMailyNode[];
  type: typeof MAILY_NODE_TYPES.TABLE_HEADER;
};

export type LinkCardAttributes = WithExtraAttrs &
  WithVisibilityAttrs & {
    badgeText: string;
    description: string;
    image: string;
    link: string;
    linkTitle: string;
    style?: string | null;
    subTitle: string;
    title: string;
  };

export type LinkCardNode = BaseMailyNode & {
  attrs: LinkCardAttributes;
  type: typeof MAILY_NODE_TYPES.LINK_CARD;
};

export type AnyMailyNode =
  | BodyNode
  | ContainerNode
  | BlockquoteNode
  | ButtonNode
  | ColumnNode
  | ColumnsNode
  | BulletListNode
  | DocumentNode
  | FooterNode
  | HardBreakNode
  | HeadingNode
  | ImageNode
  | InlineImageNode
  | InlineSpanNode
  | HorizontalRuleNode
  | HtmlCodeBlockNode
  | LinkCardNode
  | ListItemNode
  | OrderedListNode
  | ParagraphNode
  | RepeatNode
  | SectionNode
  | SpacerNode
  | TableCellNode
  | TableHeaderNode
  | TableNode
  | TableRowNode
  | TextNode
  | VariableNode;
