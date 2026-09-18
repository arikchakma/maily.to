import type { FallbackFont, FontFormat } from './font';

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
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/inter.woff2',
    },
  },
  {
    fontFamily: 'Roboto',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/roboto.woff2',
    },
  },
  {
    fontFamily: 'Open Sans',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/open-sans.woff2',
    },
  },
  {
    fontFamily: 'Lato',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/lato.woff2',
    },
  },
  {
    fontFamily: 'Montserrat',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/montserrat.woff2',
    },
  },
  {
    fontFamily: 'Poppins',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/poppins.woff2',
    },
  },
  {
    fontFamily: 'Raleway',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/raleway.woff2',
    },
  },
  {
    fontFamily: 'Ubuntu',
    webFont: {
      format: 'woff2',
      url: 'https://cdn.usemaily.com/fonts/v0/ubuntu.woff2',
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

export const FONT_SIZE_PRESETS = [
  { value: 12, label: 'Small' },
  { value: 14, label: 'Normal' },
  { value: 16, label: 'Medium' },
  { value: 18, label: 'Large' },
  { value: 24, label: 'XL' },
  { value: 32, label: '2XL' },
] as const;

export const LINE_HEIGHT_PRESETS = [
  { value: 1, label: 'Tight' },
  { value: 1.25, label: 'Snug' },
  { value: 1.5, label: 'Normal' },
  { value: 1.75, label: 'Relaxed' },
  { value: 2, label: 'Loose' },
] as const;

export const DEFAULT_FONT_FAMILY: FontFamily = 'Inter';
export const DEFAULT_FONT_FALLBACK: FallbackFont = 'sans-serif';
