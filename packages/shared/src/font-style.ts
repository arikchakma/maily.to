import type { Properties } from 'csstype';

import type { FallbackFont, FontFormat } from './font';
import type { FontWeight } from './font-weight';
import { isDef } from './is';

/**
 * Entry for the font picker dropdown. Web fonts include a CDN URL
 * and format for @font-face loading; system fonts omit the webFont field.
 */
export type FontFamilyItem = {
  fontFamily: string;
  label?: string;
  webFont?: { url: string; format: FontFormat };
};

/**
 * Built-in font options served from the Maily CDN. System fonts
 * (Arial, Helvetica, etc.) are included without a webFont field.
 */
export const DEFAULT_FONT_FAMILIES: FontFamilyItem[] = [
  {
    fontFamily: 'Inter',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/inter.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Roboto',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/roboto.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Open Sans',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/open-sans.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Lato',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/lato.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Montserrat',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/montserrat.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Poppins',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/poppins.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Raleway',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/raleway.woff2',
      format: 'woff2',
    },
  },
  {
    fontFamily: 'Ubuntu',
    webFont: {
      url: 'https://cdn.usemaily.com/fonts/v0/ubuntu.woff2',
      format: 'woff2',
    },
  },
  { fontFamily: 'Arial' },
  { fontFamily: 'Helvetica' },
  { fontFamily: 'Georgia' },
  { fontFamily: 'Times New Roman' },
  { fontFamily: 'Verdana' },
  { fontFamily: 'Courier New' },
  { fontFamily: 'Trebuchet MS' },
];

export type FontFamily = string;

export const FONT_STYLES = {
  NORMAL: 'normal',
  ITALIC: 'italic',
} as const;

export type FontStyleValue = (typeof FONT_STYLES)[keyof typeof FONT_STYLES];

/** Preset options for the font size dropdown in the editor. */
export const FONT_SIZE_PRESETS = [
  { value: 12, label: 'Small' },
  { value: 14, label: 'Normal' },
  { value: 16, label: 'Medium' },
  { value: 18, label: 'Large' },
  { value: 24, label: 'XL' },
  { value: 32, label: '2XL' },
] as const;

/** Preset options for the line height dropdown in the editor. */
export const LINE_HEIGHT_PRESETS = [
  { value: 1, label: 'Tight' },
  { value: 1.25, label: 'Snug' },
  { value: 1.5, label: 'Normal' },
  { value: 1.75, label: 'Relaxed' },
  { value: 2, label: 'Loose' },
] as const;

export const DEFAULT_FONT_FAMILY: FontFamily = 'Inter';
export const DEFAULT_FONT_SIZE = 15;
export const DEFAULT_FONT_WEIGHT: FontWeight = 400;
export const DEFAULT_LINE_HEIGHT = 1.75;
export const DEFAULT_FONT_FALLBACK: FallbackFont = 'sans-serif';

/**
 * Per-node font style overrides. Null values mean "inherit from
 * the theme defaults" — only non-null values produce inline CSS.
 */
export type FontStyleAttributes = {
  fontFamily: FontFamily | null;
  fontFallback: FallbackFont | null;
  fontSize: number | null;
  fontWeight: FontWeight | null;
  lineHeight: number | null;
  fontStyle: FontStyleValue | null;
};

/**
 * Baseline font values used when a node's FontStyleAttributes are null.
 * Each node type (paragraph, heading, button, etc.) has its own defaults
 * defined in the renderer theme.
 */
export type NodeFontStyleDefaults = {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  fontStyle?: FontStyleValue;
};

/**
 * Builds a CSS properties object from a node's font attributes,
 * falling back to the provided defaults for any null values.
 * Only includes properties that have a resolved value.
 */
export function getFontStyle(
  attrs: FontStyleAttributes,
  defaults?: Partial<NodeFontStyleDefaults>
): Properties {
  const {
    fontFamily,
    fontFallback,
    fontSize,
    fontWeight,
    lineHeight,
    fontStyle,
  } = attrs;

  const size = fontSize ?? defaults?.fontSize;
  const weight = fontWeight ?? defaults?.fontWeight;
  const line = lineHeight ?? defaults?.lineHeight;
  const style = fontStyle ?? defaults?.fontStyle;

  const fontFamilyParts = [fontFamily, fontFallback].filter(Boolean);

  return {
    ...(fontFamilyParts.length > 0 && {
      fontFamily: fontFamilyParts.join(', '),
    }),
    ...(isDef(size) ? { fontSize: `${size}px` } : {}),
    ...(isDef(weight) ? { fontWeight: weight } : {}),
    ...(isDef(line) ? { lineHeight: line } : {}),
    ...(isDef(style) ? { fontStyle: style } : {}),
  };
}
