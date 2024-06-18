import type { CSSProperties } from 'react';
import type {
  AllowedHeadings,
  AllowedLogoSizes,
  AllowedSpacers,
  RenderOptions,
  ThemeOptions,
} from './types';

export const allowedSpacers = ['sm', 'md', 'lg', 'xl'] as const;
export const spacers: Record<AllowedSpacers, string> = {
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
};

export const antialiased: CSSProperties = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

export const allowedHeadings = ['h1', 'h2', 'h3'] as const;
export const headings: Record<AllowedHeadings, CSSProperties> = {
  h1: {
    fontSize: '36px',
    lineHeight: '40px',
    fontWeight: 800,
  },
  h2: {
    fontSize: '30px',
    lineHeight: '36px',
    fontWeight: 700,
  },
  h3: {
    fontSize: '24px',
    lineHeight: '38px',
    fontWeight: 600,
  },
};

export const allowedLogoSizes = ['sm', 'md', 'lg'] as const;
export const logoSizes: Record<AllowedLogoSizes, string> = {
  sm: '40px',
  md: '48px',
  lg: '64px',
};

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  pretty: false,
  plainText: false,
};

export const DEFAULT_THEME: ThemeOptions = {
  colors: {
    heading: 'rgb(17, 24, 39)',
    paragraph: 'rgb(55, 65, 81)',
    horizontal: 'rgb(234, 234, 234)',
    footer: 'rgb(100, 116, 139)',
    blockquoteBorder: 'rgb(209, 213, 219)',
    codeBackground: 'rgb(239, 239, 239)',
    codeText: 'rgb(17, 24, 39)',
  },
  fontSize: {
    paragraph: '15px',
    footer: {
      size: '14px',
      lineHeight: '24px',
    },
  },
};

export const CODE_FONT_FAMILY =
  'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
