import type {
  AnyMailyMark,
  BoldMark,
  CodeMark,
  HighlightMark,
  ItalicMark,
  LinkMark,
  MailyMarkType,
  SpanMark,
  StrikeMark,
  TextStyleMark,
  UnderlineMark,
} from './mark';
import { allowedMarkTypes, MAILY_MARK_TYPES } from './mark';
import type {
  AnyMailyNode,
  BlockquoteNode,
  BodyNode,
  BulletListNode,
  ContainerNode,
  DocumentNode,
  FooterNode,
  HardBreakNode,
  HeadingNode,
  HorizontalRuleNode,
  HtmlCodeBlockNode,
  ImageNode,
  InlineImageNode,
  InlineSpanNode,
  LinkCardNode,
  ListItemNode,
  MailyNodeType,
  OrderedListNode,
  ButtonNode,
  ColumnNode,
  ColumnsNode,
  ParagraphNode,
  RepeatNode,
  SectionNode,
  SpacerNode,
  TableCellNode,
  TableHeaderNode,
  TableNode,
  TableRowNode,
  TextNode,
  VariableNode,
} from './node';
import { allowedNodeTypes, MAILY_NODE_TYPES } from './node';

function guard<T extends AnyMailyNode | AnyMailyMark>(type: string) {
  return (value: AnyMailyNode | AnyMailyMark): value is T =>
    value.type === type;
}

export function isObject(val: unknown): val is object {
  return typeof val === 'object' && val !== null;
}

export const is = {
  node(value: unknown): value is AnyMailyNode {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      allowedNodeTypes.includes(value.type as MailyNodeType)
    );
  },
  mark(value: unknown): value is AnyMailyMark {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      allowedMarkTypes.includes(value.type as MailyMarkType)
    );
  },
  parent(
    node: AnyMailyNode
  ): node is AnyMailyNode & { content: AnyMailyNode[] } {
    return Array.isArray(node?.content);
  },
  marked(node: AnyMailyNode): node is AnyMailyNode & { marks: AnyMailyMark[] } {
    return Array.isArray(node?.marks);
  },
  doc: guard<DocumentNode>(MAILY_NODE_TYPES.DOCUMENT),
  body: guard<BodyNode>(MAILY_NODE_TYPES.BODY),
  container: guard<ContainerNode>(MAILY_NODE_TYPES.CONTAINER),
  section: guard<SectionNode>(MAILY_NODE_TYPES.SECTION),
  columns: guard<ColumnsNode>(MAILY_NODE_TYPES.COLUMNS),
  column: guard<ColumnNode>(MAILY_NODE_TYPES.COLUMN),
  image: guard<ImageNode>(MAILY_NODE_TYPES.IMAGE),
  inlineImage: guard<InlineImageNode>(MAILY_NODE_TYPES.INLINE_IMAGE),
  inlineSpan: guard<InlineSpanNode>(MAILY_NODE_TYPES.INLINE_SPAN),
  spacer: guard<SpacerNode>(MAILY_NODE_TYPES.SPACER),
  button: guard<ButtonNode>(MAILY_NODE_TYPES.BUTTON),
  footer: guard<FooterNode>(MAILY_NODE_TYPES.FOOTER),
  paragraph: guard<ParagraphNode>(MAILY_NODE_TYPES.PARAGRAPH),
  heading: guard<HeadingNode>(MAILY_NODE_TYPES.HEADING),
  blockquote: guard<BlockquoteNode>(MAILY_NODE_TYPES.BLOCKQUOTE),
  horizontalRule: guard<HorizontalRuleNode>(MAILY_NODE_TYPES.HORIZONTAL_RULE),
  hardBreak: guard<HardBreakNode>(MAILY_NODE_TYPES.HARD_BREAK),
  htmlCodeBlock: guard<HtmlCodeBlockNode>(MAILY_NODE_TYPES.HTML_CODE_BLOCK),
  repeat: guard<RepeatNode>(MAILY_NODE_TYPES.REPEAT),
  bulletList: guard<BulletListNode>(MAILY_NODE_TYPES.BULLET_LIST),
  orderedList: guard<OrderedListNode>(MAILY_NODE_TYPES.ORDERED_LIST),
  listItem: guard<ListItemNode>(MAILY_NODE_TYPES.LIST_ITEM),
  linkCard: guard<LinkCardNode>(MAILY_NODE_TYPES.LINK_CARD),
  text: guard<TextNode>(MAILY_NODE_TYPES.TEXT),
  variable: guard<VariableNode>(MAILY_NODE_TYPES.VARIABLE),
  table: guard<TableNode>(MAILY_NODE_TYPES.TABLE),
  tableRow: guard<TableRowNode>(MAILY_NODE_TYPES.TABLE_ROW),
  tableCell: guard<TableCellNode>(MAILY_NODE_TYPES.TABLE_CELL),
  tableHeader: guard<TableHeaderNode>(MAILY_NODE_TYPES.TABLE_HEADER),
  bold: guard<BoldMark>(MAILY_MARK_TYPES.BOLD),
  italic: guard<ItalicMark>(MAILY_MARK_TYPES.ITALIC),
  strike: guard<StrikeMark>(MAILY_MARK_TYPES.STRIKE),
  underline: guard<UnderlineMark>(MAILY_MARK_TYPES.UNDERLINE),
  link: guard<LinkMark>(MAILY_MARK_TYPES.LINK),
  code: guard<CodeMark>(MAILY_MARK_TYPES.CODE),
  textStyle: guard<TextStyleMark>(MAILY_MARK_TYPES.TEXT_STYLE),
  highlight: guard<HighlightMark>(MAILY_MARK_TYPES.HIGHLIGHT),
  span: guard<SpanMark>(MAILY_MARK_TYPES.SPAN),
};

export function isDef<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}
