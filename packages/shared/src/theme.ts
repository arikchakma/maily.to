import type * as CSS from 'csstype';

type FallbackFont =
  | 'Arial'
  | 'Helvetica'
  | 'Verdana'
  | 'Georgia'
  | 'Times New Roman'
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'cursive'
  | 'fantasy';
type FontFormat =
  | 'woff'
  | 'woff2'
  | 'truetype'
  | 'opentype'
  | 'embedded-opentype'
  | 'svg';
type FontWeight = CSS.Properties['fontWeight'];
type FontStyle = CSS.Properties['fontStyle'];

export interface FontProps {
  /** The font you want to use. NOTE: Do not insert multiple fonts here, use fallbackFontFamily for that */
  fontFamily: string;
  /** An array is possible, but the order of the array is the priority order */
  fallbackFontFamily: FallbackFont | FallbackFont[];
  /** Not all clients support web fonts. For support check: https://www.caniemail.com/features/css-at-font-face/ */
  webFont?: {
    url: string;
    format: FontFormat;
  };
  /** Default: 'normal' */
  fontStyle?: FontStyle;
  /** Default: 400 */
  fontWeight?: FontWeight;
}

export interface BaseThemeOptions {
  container?: Partial<
    Pick<
      CSS.Properties,
      | 'backgroundColor'
      | 'maxWidth'
      | 'minWidth'
      | 'paddingTop'
      | 'paddingRight'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'borderRadius'
      | 'borderWidth'
      | 'borderColor'
    >
  >;
  body?: Partial<
    Pick<
      CSS.Properties,
      | 'backgroundColor'
      | 'paddingTop'
      | 'paddingRight'
      | 'paddingBottom'
      | 'paddingLeft'
    >
  >;
  button?: Partial<
    Pick<
      CSS.Properties,
      | 'paddingTop'
      | 'paddingRight'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'backgroundColor'
      | 'color'
    >
  >;
  link?: Partial<Pick<CSS.Properties, 'color'>>;
  font?: Partial<FontProps>;
}

/**
 * The theme options for the editor.
 * currently, we don't allow any customizations for the colors in the editor.
 * that's why we have a separate theme for the editor.
 */
export interface EditorThemeOptions extends BaseThemeOptions {}

/**
 * The theme options for the renderer.
 * currently, we don't allow any customizations for the colors in the editor.
 * that's why we have a separate theme for the renderer.
 */
export interface RendererThemeOptions extends BaseThemeOptions {
  colors?: Partial<{
    heading: string;
    paragraph: string;
    horizontal: string;
    footer: string;
    blockquoteBorder: string;
    codeBackground: string;
    codeText: string;
    linkCardTitle: string;
    linkCardDescription: string;
    linkCardBadgeText: string;
    linkCardBadgeBackground: string;
    linkCardSubTitle: string;
  }>;
  fontSize?: Partial<{
    paragraph: Partial<{
      size: string;
      lineHeight: string;
    }>;
    footer: Partial<{
      size: string;
      lineHeight: string;
    }>;
  }>;
}

export const DEFAULT_FONT: FontProps = {
  fallbackFontFamily: 'sans-serif',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 400,
  webFont: {
    url: 'https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19',
    format: 'woff2',
  },
};

export const DEFAULT_LINK_TEXT_COLOR = '#111827';

export const DEFAULT_RENDERER_THEME: RendererThemeOptions = {
  colors: {
    heading: '#111827',
    paragraph: '#374151',
    horizontal: '#EAEAEA',
    footer: '#64748B',
    blockquoteBorder: '#D1D5DB',
    codeBackground: '#EFEFEF',
    codeText: '#111827',
    linkCardTitle: '#111827',
    linkCardDescription: '#6B7280',
    linkCardBadgeText: '#111827',
    linkCardBadgeBackground: '#FEF08A',
    linkCardSubTitle: '#6B7280',
  },
  fontSize: {
    paragraph: {
      size: '15px',
      lineHeight: '26.25px',
    },
    footer: {
      size: '14px',
      lineHeight: '24px',
    },
  },

  container: {
    backgroundColor: '#ffffff',
    maxWidth: '600px',
    minWidth: '300px',
    paddingTop: '0.5rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingLeft: '0.5rem',

    borderRadius: '0px',
    borderWidth: '0px',
    borderColor: 'transparent',
  },
  body: {
    backgroundColor: '#ffffff',

    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingTop: '10px',
    paddingRight: '32px',
    paddingBottom: '10px',
    paddingLeft: '32px',
  },
  link: {
    color: DEFAULT_LINK_TEXT_COLOR,
  },
  font: DEFAULT_FONT,
};

export const DEFAULT_EDITOR_THEME: EditorThemeOptions = {
  container: {
    backgroundColor: '#ffffff',
    maxWidth: '600px',
    minWidth: '300px',
    paddingTop: '8px',
    paddingRight: '8px',
    paddingBottom: '8px',
    paddingLeft: '8px',

    borderRadius: '0px',
    borderWidth: '0px',
    borderColor: 'transparent',
  },
  body: {
    backgroundColor: '#ffffff',

    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingTop: '10px',
    paddingRight: '32px',
    paddingBottom: '10px',
    paddingLeft: '32px',
  },
  link: {
    color: DEFAULT_LINK_TEXT_COLOR,
  },
};
