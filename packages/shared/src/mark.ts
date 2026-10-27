export const MAILY_MARK_TYPES = {
  BOLD: 'bold',
  ITALIC: 'italic',
  STRIKE: 'strike',
  UNDERLINE: 'underline',
  LINK: 'link',
  CODE: 'code',
  TEXT_STYLE: 'textStyle',
  HIGHLIGHT: 'highlight',
  SPAN: 'span',
} as const;

export const allowedMarkTypes = Object.values(MAILY_MARK_TYPES);

export type MailyMarkType =
  (typeof MAILY_MARK_TYPES)[keyof typeof MAILY_MARK_TYPES];

export type MarkStyleAttributes = {
  style?: string | null;
};

export type BaseMailyMark = {
  attrs?: MarkStyleAttributes & Record<string, unknown>;
  type: MailyMarkType;
};

export type BoldMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.BOLD;
};

export type ItalicMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.ITALIC;
};

export type StrikeMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.STRIKE;
};

export type UnderlineMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.UNDERLINE;
};

export type LinkAttributes = MarkStyleAttributes & {
  class?: string | null;
  href: string;
  rel?: string | null;
  target?: string | null;
  title?: string | null;
};

export type LinkMark = BaseMailyMark & {
  attrs: LinkAttributes;
  type: typeof MAILY_MARK_TYPES.LINK;
};

export type CodeMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.CODE;
};

export type TextStyleAttributes = MarkStyleAttributes & {
  color: string;
};

export type TextStyleMark = BaseMailyMark & {
  attrs: TextStyleAttributes;
  type: typeof MAILY_MARK_TYPES.TEXT_STYLE;
};

export type HighlightAttributes = MarkStyleAttributes & {
  color: string;
};

export type HighlightMark = BaseMailyMark & {
  attrs: HighlightAttributes;
  type: typeof MAILY_MARK_TYPES.HIGHLIGHT;
};

export type SpanMark = BaseMailyMark & {
  attrs?: MarkStyleAttributes;
  type: typeof MAILY_MARK_TYPES.SPAN;
};

export type AnyMailyMark =
  | BoldMark
  | ItalicMark
  | StrikeMark
  | UnderlineMark
  | LinkMark
  | CodeMark
  | TextStyleMark
  | HighlightMark
  | SpanMark;
