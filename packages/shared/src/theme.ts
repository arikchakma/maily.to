import { DEFAULT_FONT, getFontFamilyValue } from './font';
import { MAILY_NODE_TYPES } from './node';
import { deepMerge } from './object';
import type { InlineStyle } from './style';

export type NodeThemeOptions = {
  blockquote?: InlineStyle;
  body?: InlineStyle;
  bulletList?: InlineStyle;
  button?: InlineStyle;
  code?: InlineStyle;
  container?: InlineStyle;
  footer?: InlineStyle;
  h1?: InlineStyle;
  h2?: InlineStyle;
  h3?: InlineStyle;
  heading?: InlineStyle;
  horizontalRule?: InlineStyle;
  htmlCodeBlock?: InlineStyle;
  link?: InlineStyle;
  listItem?: InlineStyle;
  orderedList?: InlineStyle;
  paragraph?: InlineStyle;
  section?: InlineStyle;
  table?: InlineStyle;
  tableCell?: InlineStyle;
  tableRow?: InlineStyle;
};

export const DEFAULT_CONTAINER_MAX_WIDTH = 600;

export const BASIC_NODE_THEME: NodeThemeOptions = {
  blockquote: {
    borderColor: '#d1d5db',
    borderLeftStyle: 'solid',
    borderLeftWidth: '4px',
    color: '#374151',
    fontSize: '15px',
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: '26px',
    marginBottom: '20px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '20px',
    paddingLeft: '16px',
  },
  body: {
    fontFamily: getFontFamilyValue({
      fallbackFontFamily: DEFAULT_FONT.fallbackFontFamily,
      fontFamily: DEFAULT_FONT.fontFamily,
    }),
  },
  bulletList: {
    fontSize: '14px',
    lineHeight: '24px',
    listStyleType: 'disc',
    margin: '0',
    paddingLeft: '26px',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: '9999px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    padding: '10px 32px',
  },
  code: {
    borderRadius: '8px',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '85%',
    padding: '2px 6px',
  },
  h1: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: '40px',
  },
  h2: {
    fontSize: '30px',
    fontWeight: '700',
    lineHeight: '40px',
  },
  h3: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '38px',
  },
  heading: {
    color: '#101828',
    marginBottom: '12px',
    marginTop: '0',
  },
  horizontalRule: {
    border: 'none',
    borderTop: '1px solid #eaeaea',
    marginBottom: '32px',
    marginTop: '32px',
  },
  htmlCodeBlock: {
    marginBottom: '32px',
  },
  link: {
    color: '#0000ee',
    textDecoration: 'underline',
  },
  listItem: {
    marginBottom: '4px',
    paddingLeft: '6px',
  },
  orderedList: {
    fontSize: '14px',
    lineHeight: '24px',
    listStyleType: 'decimal',
    margin: '0',
    paddingLeft: '26px',
  },
  footer: {
    color: '#64748B',
    display: 'block',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '24px',
    marginBottom: '0',
    marginTop: '0',
  },
  paragraph: {
    color: '#18181b',
    fontSize: '14px',
    lineHeight: '24px',
    marginBottom: '14px',
    marginTop: '0',
  },
  section: {
    padding: '8px',
  },
};

export const MAILY_NODE_THEME: NodeThemeOptions = {
  blockquote: {
    borderLeftColor: '#d1d5db',
    borderLeftStyle: 'solid',
    borderLeftWidth: '4px',
    color: '#374151',
    fontSize: '15px',
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: '1.75',
    marginBottom: '20px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '20px',
    paddingLeft: '16px',
  },
  body: {
    backgroundColor: '#ffffff',
    fontFamily: getFontFamilyValue({
      fallbackFontFamily: DEFAULT_FONT.fallbackFontFamily,
      fontFamily: DEFAULT_FONT.fontFamily,
    }),
    padding: '0',
  },
  bulletList: {
    listStyleType: 'disc',
    marginBottom: '20px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    paddingLeft: '26px',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: '9999px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.4285714',
    marginBottom: '20px',
    padding: '10px 32px',
  },
  code: {
    backgroundColor: '#efefef',
    borderRadius: '8px',
    color: '#111827',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '85%',
    padding: '2px 6px',
  },
  container: {
    backgroundColor: '#ffffff',
    maxWidth: `${DEFAULT_CONTAINER_MAX_WIDTH}px`,
    minWidth: '300px',
    padding: '8px',
  },
  footer: {
    color: '#64748b',
    display: 'block',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.7142857',
    marginBottom: '20px',
    marginTop: '0',
  },
  h1: {
    fontSize: '36px',
    fontWeight: '600',
    lineHeight: '1.1111111',
  },
  h2: {
    fontSize: '30px',
    fontWeight: '600',
    lineHeight: '1.3333333',
  },
  h3: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.6',
  },
  heading: {
    color: '#111827',
    marginBottom: '12px',
    marginTop: '0',
  },
  horizontalRule: {
    border: 'none',
    borderTop: '1px solid #eaeaea',
    marginBottom: '32px',
    marginTop: '32px',
  },
  htmlCodeBlock: {
    marginBottom: '32px',
  },
  link: {
    color: '#111827',
    textDecoration: 'underline',
  },
  listItem: {
    color: '#d1d5dc',
    marginBottom: '8px',
    marginTop: '8px',
    paddingLeft: '6px',
  },
  orderedList: {
    listStyleType: 'decimal',
    marginBottom: '20px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    paddingLeft: '26px',
  },
  paragraph: {
    color: '#374151',
    fontSize: '15px',
    fontWeight: '400',
    lineHeight: '1.75',
    marginBottom: '20px',
    marginTop: '0',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
  },
  section: {
    backgroundColor: '#f7f7f7',
    border: '2px solid #e2e2e2',
    borderRadius: '0',
    marginBottom: '20px',
    padding: '0',
  },
};

export type ExtendNodeThemeOptions = {
  extension: NodeThemeOptions;
  preset: NodeThemeOptions;
};

export function extendNodeTheme(
  options: ExtendNodeThemeOptions
): NodeThemeOptions {
  const { extension, preset } = options;

  return deepMerge(preset, extension);
}

export type ThemeDeclarationsOptions = {
  attrs?: Record<string, unknown> | undefined;
  theme: NodeThemeOptions;
  type: string;
};

export function getThemeDeclarations(
  options: ThemeDeclarationsOptions
): InlineStyle | undefined {
  const { attrs, theme, type } = options;
  const declarations = theme[type as keyof NodeThemeOptions];

  if (type !== MAILY_NODE_TYPES.HEADING) {
    return declarations;
  }

  const level =
    typeof attrs?.level === 'number'
      ? theme[`h${attrs.level}` as keyof NodeThemeOptions]
      : undefined;
  if (!(declarations || level)) {
    return;
  }

  return { ...declarations, ...level };
}
