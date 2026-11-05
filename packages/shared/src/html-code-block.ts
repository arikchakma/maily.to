/**
 * Tab options for the HTML code block node.
 * "code" shows the raw HTML source, "preview" renders it visually.
 */
export const HTML_CODE_BLOCK_TABS = {
  CODE: 'code',
  PREVIEW: 'preview',
} as const;

export type AllowedHtmlCodeBlockTab =
  (typeof HTML_CODE_BLOCK_TABS)[keyof typeof HTML_CODE_BLOCK_TABS];

export const DEFAULT_HTML_CODE_BLOCK_TAB: AllowedHtmlCodeBlockTab =
  HTML_CODE_BLOCK_TABS.CODE;
