import type {
  AnyMailyMark,
  BoldMark,
  CodeMark,
  HighlightMark,
  ItalicMark,
  LinkMark,
  MailyMarkType,
  StrikeMark,
  TextStyleMark,
  UnderlineMark,
} from './mark';
import { allowedMarkTypes, MAILY_MARK_TYPES } from './mark';
import type {
  AnyMailyNode,
  BlockquoteNode,
  BulletListNode,
  ButtonNode,
  ColumnNode,
  ColumnsNode,
  DocumentNode,
  FooterNode,
  HardBreakNode,
  HeadingNode,
  HorizontalRuleNode,
  HtmlCodeBlockNode,
  ImageNode,
  InlineImageNode,
  LinkCardNode,
  ListItemNode,
  MailyNodeType,
  OrderedListNode,
  ParagraphNode,
  RepeatNode,
  SectionNode,
  SpacerNode,
  TextNode,
  VariableNode,
} from './node';
import { allowedNodeTypes, MAILY_NODE_TYPES } from './node';

function guard<T extends AnyMailyNode | AnyMailyMark>(type: string) {
  return (node: AnyMailyNode | AnyMailyMark): node is T => node.type === type;
}

/**
 * Type guards for Maily nodes and marks. Provides narrowing functions
 * for every node type (is.paragraph, is.button, etc.) and mark type
 * (is.bold, is.link, etc.), plus structural checks like is.parent
 * and is.marked. Each guard narrows the input to its specific type.
 *
 * Example:
 *   if (is.paragraph(node)) {
 *     node.attrs.textAlign // narrowed to ParagraphNode
 *   }
 */
export const is = {
  any(value: unknown): value is AnyMailyNode | AnyMailyMark {
    return this.node(value) || this.mark(value);
  },
  parent(
    node: AnyMailyNode
  ): node is AnyMailyNode & { content: AnyMailyNode[] } {
    return Array.isArray(node?.content);
  },
  marked(node: AnyMailyNode): node is AnyMailyNode & { marks: AnyMailyMark[] } {
    return Array.isArray(node?.marks);
  },
  // Node
  node(node: unknown): node is AnyMailyNode {
    return (
      typeof node === 'object' &&
      node !== null &&
      'type' in node &&
      allowedNodeTypes.includes(node.type as MailyNodeType)
    );
  },
  doc: guard<DocumentNode>(MAILY_NODE_TYPES.DOCUMENT),
  paragraph: guard<ParagraphNode>(MAILY_NODE_TYPES.PARAGRAPH),
  text: guard<TextNode>(MAILY_NODE_TYPES.TEXT),
  heading: guard<HeadingNode>(MAILY_NODE_TYPES.HEADING),
  variable: guard<VariableNode>(MAILY_NODE_TYPES.VARIABLE),
  image: guard<ImageNode>(MAILY_NODE_TYPES.IMAGE),
  inlineImage: guard<InlineImageNode>(MAILY_NODE_TYPES.INLINE_IMAGE),
  spacer: guard<SpacerNode>(MAILY_NODE_TYPES.SPACER),
  section: guard<SectionNode>(MAILY_NODE_TYPES.SECTION),
  button: guard<ButtonNode>(MAILY_NODE_TYPES.BUTTON),
  columns: guard<ColumnsNode>(MAILY_NODE_TYPES.COLUMNS),
  column: guard<ColumnNode>(MAILY_NODE_TYPES.COLUMN),
  repeat: guard<RepeatNode>(MAILY_NODE_TYPES.REPEAT),
  bulletList: guard<BulletListNode>(MAILY_NODE_TYPES.BULLET_LIST),
  orderedList: guard<OrderedListNode>(MAILY_NODE_TYPES.ORDERED_LIST),
  listItem: guard<ListItemNode>(MAILY_NODE_TYPES.LIST_ITEM),
  horizontalRule: guard<HorizontalRuleNode>(MAILY_NODE_TYPES.HORIZONTAL_RULE),
  htmlCodeBlock: guard<HtmlCodeBlockNode>(MAILY_NODE_TYPES.HTML_CODE_BLOCK),
  blockquote: guard<BlockquoteNode>(MAILY_NODE_TYPES.BLOCKQUOTE),
  hardBreak: guard<HardBreakNode>(MAILY_NODE_TYPES.HARD_BREAK),
  footer: guard<FooterNode>(MAILY_NODE_TYPES.FOOTER),
  linkCard: guard<LinkCardNode>(MAILY_NODE_TYPES.LINK_CARD),

  // Mark
  mark(mark: unknown): mark is AnyMailyMark {
    return (
      typeof mark === 'object' &&
      mark !== null &&
      'type' in mark &&
      allowedMarkTypes.includes(mark.type as MailyMarkType)
    );
  },
  bold: guard<BoldMark>(MAILY_MARK_TYPES.BOLD),
  italic: guard<ItalicMark>(MAILY_MARK_TYPES.ITALIC),
  strike: guard<StrikeMark>(MAILY_MARK_TYPES.STRIKE),
  underline: guard<UnderlineMark>(MAILY_MARK_TYPES.UNDERLINE),
  link: guard<LinkMark>(MAILY_MARK_TYPES.LINK),
  code: guard<CodeMark>(MAILY_MARK_TYPES.CODE),
  textStyle: guard<TextStyleMark>(MAILY_MARK_TYPES.TEXT_STYLE),
  highlight: guard<HighlightMark>(MAILY_MARK_TYPES.HIGHLIGHT),
};

/** Type guard that checks if a value is defined (not null or undefined). */
export function isDef<T = any>(val?: T | null): val is T {
  return val !== undefined && val !== null;
}

/** Type guard that checks if a value is a boolean. */
export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

/** Type guard that checks if a value is a number. */
export function isNumber(val: any): val is number {
  return typeof val === 'number';
}

/** Type guard that checks if a value is a string. */
export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

/** Type guard that checks if a value is a non-null object. */
export function isObject(val: unknown): val is object {
  return typeof val === 'object' && val !== null;
}
