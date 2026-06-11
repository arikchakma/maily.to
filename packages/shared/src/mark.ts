/** Registry of all inline mark type strings used in the document JSON. */
export const MAILY_MARK_TYPES = {
  BOLD: 'bold',
  ITALIC: 'italic',
  STRIKE: 'strike',
  UNDERLINE: 'underline',
  LINK: 'link',
  CODE: 'code',
  TEXT_STYLE: 'textStyle',
  HIGHLIGHT: 'highlight',
} as const;

export type MailyMarkType =
  (typeof MAILY_MARK_TYPES)[keyof typeof MAILY_MARK_TYPES];

export const allowedMarkTypes = Object.values(MAILY_MARK_TYPES);

/**
 * Base shape shared by all inline marks. Individual mark types
 * narrow the type field and optionally add typed attrs.
 */
export type BaseMailyMark = {
  type: MailyMarkType;
  attrs?: Record<string, any>;
};

/** Bold */
export type BoldMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.BOLD;
};

/** Italic */
export type ItalicMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.ITALIC;
};

/** Strike */
export type StrikeMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.STRIKE;
};

/** Underline */
export type UnderlineMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.UNDERLINE;
};

/** Link */
export type LinkAttributes = {
  href: string;
  target?: string;
};

export type LinkMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.LINK;
  attrs: LinkAttributes;
};

/** Code */
export type CodeAttributes = {};

export type CodeMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.CODE;
  attrs: CodeAttributes;
};

/** Text Style */
export type TextStyleAttributes = {
  color: string;
};

export type TextStyleMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.TEXT_STYLE;
  attrs: TextStyleAttributes;
};

/** Highlight */
export type HighlightAttributes = {
  color: string;
};

export type HighlightMark = BaseMailyMark & {
  type: typeof MAILY_MARK_TYPES.HIGHLIGHT;
  attrs: HighlightAttributes;
};

export type AnyMailyMark =
  | BoldMark
  | ItalicMark
  | StrikeMark
  | UnderlineMark
  | LinkMark
  | CodeMark
  | TextStyleMark
  | HighlightMark;
