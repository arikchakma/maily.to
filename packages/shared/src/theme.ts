import type { FontProps } from './font';
import { DEFAULT_FONT } from './font';
import { FONT_STYLES } from './font-style';
import type { FontStyleValue, NodeFontStyleDefaults } from './font-style';
import { FONT_WEIGHTS } from './font-weight';
import type { HeadingLevel } from './node';
import { MAILY_NODE_TYPES } from './node';

/**
 * Shared theme properties used by both the editor and renderer.
 * Controls global styling for the body, container, buttons, links,
 * and font. Extended by EditorThemeOptions and RendererThemeOptions.
 */
export interface BaseThemeOptions {
  container?: Partial<{
    backgroundColor: string;
    maxWidth: number;
    minWidth: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;

    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  }>;
  body?: Partial<{
    backgroundColor: string;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  }>;
  button?: Partial<{
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    backgroundColor: string;
    color: string;
  }>;
  link?: Partial<{
    color: string;
  }>;
  font?: Pick<
    FontProps,
    'fontFamily' | 'fallbackFontFamily' | 'webFont'
  > | null;
  listMarker?: Partial<{
    color: string;
  }>;
}

/**
 * Editor-specific theme. Currently identical to the base — the editor
 * does not yet support per-node color customization, which is why
 * it's kept separate from the renderer theme.
 */
export interface EditorThemeOptions extends BaseThemeOptions {}

/** Per-node styling overrides in the renderer theme. */
export type NodeThemeEntry = Partial<{
  color: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
}>;

export type HeadingLevelTheme = Partial<{
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
}>;

/**
 * Renderer-specific theme. Extends the base with per-node styling
 * grouped by node type — each key corresponds to a node and contains
 * all relevant style properties for that node.
 */
export interface RendererThemeOptions extends BaseThemeOptions {
  paragraph?: NodeThemeEntry;
  heading?: Partial<{
    defaults: Partial<{ color: string }>;
    h1: HeadingLevelTheme;
    h2: HeadingLevelTheme;
    h3: HeadingLevelTheme;
  }>;
  footer?: NodeThemeEntry;
  blockquote?: NodeThemeEntry &
    Partial<{
      borderColor: string;
      fontStyle: FontStyleValue;
    }>;
  horizontalRule?: Partial<{ color: string }>;
  code?: Partial<{ color: string; backgroundColor: string }>;

  button?: BaseThemeOptions['button'] &
    Partial<{
      fontSize: number;
      lineHeight: number;
      fontWeight: number;
    }>;
  linkCard?: Partial<{
    titleColor: string;
    descriptionColor: string;
    badgeTextColor: string;
    badgeBackgroundColor: string;
    subTitleColor: string;
    borderColor: string;
  }>;
}

export const DEFAULT_LINK_TEXT_COLOR = '#111827';

export const DEFAULT_RENDERER_THEME: RendererThemeOptions = {
  paragraph: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 1.75,
    fontWeight: FONT_WEIGHTS.NORMAL,
  },
  heading: {
    defaults: { color: '#111827' },
    h1: {
      fontSize: 36,
      lineHeight: 1.1111111,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
    h2: {
      fontSize: 30,
      lineHeight: 1.3333333,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
    h3: {
      fontSize: 24,
      lineHeight: 1.6,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
  },
  footer: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 1.7142857,
    fontWeight: FONT_WEIGHTS.NORMAL,
  },
  blockquote: {
    color: '#374151',
    borderColor: '#D1D5DB',
    fontSize: 15,
    lineHeight: 1.75,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    fontStyle: FONT_STYLES.ITALIC,
  },
  horizontalRule: { color: '#EAEAEA' },
  code: { color: '#111827', backgroundColor: '#EFEFEF' },
  linkCard: {
    titleColor: '#111827',
    descriptionColor: '#374151',
    badgeTextColor: '#374151',
    badgeBackgroundColor: '#fff085',
    subTitleColor: '#6B7280',
    borderColor: '#E5E7EB',
  },

  container: {
    backgroundColor: '#ffffff',
    maxWidth: 600,
    minWidth: 300,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,

    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  body: {
    backgroundColor: '#ffffff',

    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingTop: 10,
    paddingRight: 32,
    paddingBottom: 10,
    paddingLeft: 32,
    fontSize: 14,
    lineHeight: 1.4285714,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
  },
  link: {
    color: DEFAULT_LINK_TEXT_COLOR,
  },
  listMarker: {
    color: '#d1d5dc',
  },
  font: DEFAULT_FONT,
};

export const DEFAULT_EDITOR_THEME: EditorThemeOptions = {
  container: {
    backgroundColor: '#ffffff',
    maxWidth: 600,
    minWidth: 300,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,

    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  body: {
    backgroundColor: '#ffffff',

    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingTop: 10,
    paddingRight: 32,
    paddingBottom: 10,
    paddingLeft: 32,
  },
  link: {
    color: DEFAULT_LINK_TEXT_COLOR,
  },
  font: DEFAULT_FONT,
};

/**
 * Resolves the baseline font defaults for a node type from the
 * renderer theme. Falls back to paragraph defaults for unknown types.
 */
export function getNodeFontStyleDefaults(
  nodeType: string,
  level?: HeadingLevel
): NodeFontStyleDefaults {
  const paragraph = DEFAULT_RENDERER_THEME.paragraph!;
  const fallback: NodeFontStyleDefaults = {
    fontSize: paragraph.fontSize!,
    lineHeight: paragraph.lineHeight!,
    fontWeight: paragraph.fontWeight!,
  };

  if (nodeType === MAILY_NODE_TYPES.HEADING) {
    const heading = DEFAULT_RENDERER_THEME.heading;
    const key = `h${level ?? 1}` as 'h1' | 'h2' | 'h3';
    const entry = heading?.[key];
    return {
      fontSize: entry?.fontSize ?? fallback.fontSize,
      lineHeight: entry?.lineHeight ?? fallback.lineHeight,
      fontWeight: entry?.fontWeight ?? fallback.fontWeight,
    };
  }

  if (nodeType === MAILY_NODE_TYPES.BUTTON) {
    const btn = DEFAULT_RENDERER_THEME.button;
    return {
      fontSize: btn?.fontSize ?? fallback.fontSize,
      lineHeight: btn?.lineHeight ?? fallback.lineHeight,
      fontWeight: btn?.fontWeight ?? fallback.fontWeight,
    };
  }

  if (nodeType === MAILY_NODE_TYPES.BLOCKQUOTE) {
    const bq = DEFAULT_RENDERER_THEME.blockquote;
    return {
      fontSize: bq?.fontSize ?? fallback.fontSize,
      lineHeight: bq?.lineHeight ?? fallback.lineHeight,
      fontWeight: bq?.fontWeight ?? fallback.fontWeight,
      fontStyle: bq?.fontStyle ?? undefined,
    };
  }

  if (nodeType === MAILY_NODE_TYPES.FOOTER) {
    const ft = DEFAULT_RENDERER_THEME.footer;
    return {
      fontSize: ft?.fontSize ?? fallback.fontSize,
      lineHeight: ft?.lineHeight ?? fallback.lineHeight,
      fontWeight: ft?.fontWeight ?? fallback.fontWeight,
    };
  }

  return fallback;
}
