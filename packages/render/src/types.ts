import type { JSONContent } from '@tiptap/core';
import type {
  allowedHeadings,
  allowedLogoSizes,
  allowedSpacers,
} from './constants';

export interface NodeOptions {
  parent?: JSONContent;
  prev?: JSONContent;
  next?: JSONContent;
}

export interface MarkType {
  [key: string]: any;
  type: string;
  attrs?: Record<string, any> | undefined;
}

export interface ThemeOptions {
  colors?: {
    heading?: string;
    paragraph?: string;
    horizontal?: string;
    footer?: string;
    blockquoteBorder?: string;
    codeBackground?: string;
    codeText?: string;
  };
  fontSize?: {
    paragraph?: string;
    footer?: {
      size?: string;
      lineHeight?: string;
    };
  };
}

export interface MailyConfig {
  /**
   * The preview text is the snippet of text that is pulled into the inbox
   * preview of an email client, usually right after the subject line.
   *
   * Default: `undefined`
   */
  preview?: string;
  /**
   * The theme object allows you to customize the colors and font sizes of the
   * rendered email.
   *
   * Default:
   * ```js
   * {
   *   colors: {
   *     heading: 'rgb(17, 24, 39)',
   *     paragraph: 'rgb(55, 65, 81)',
   *     horizontal: 'rgb(234, 234, 234)',
   *     footer: 'rgb(100, 116, 139)',
   *   },
   *   fontSize: {
   *     paragraph: '15px',
   *     footer: {
   *       size: '14px',
   *       lineHeight: '24px',
   *     },
   *   },
   * }
   * ```
   *
   * @example
   * ```js
   * const maily = new Maily(content, {
   *   theme: {
   *     colors: {
   *       heading: 'rgb(17, 24, 39)',
   *     },
   *     fontSize: {
   *       footer: {
   *         size: '14px',
   *         lineHeight: '24px',
   *       },
   *     },
   *   },
   * });
   * ```
   */
  theme?: ThemeOptions;
}

export interface RenderOptions {
  /**
   * The options object allows you to customize the output of the rendered
   * email.
   * - `pretty` - If `true`, the output will be formatted with indentation and
   *  line breaks.
   * - `plainText` - If `true`, the output will be plain text instead of HTML.
   * This is useful for testing purposes.
   *
   * Default: `pretty` - `false`, `plainText` - `false`
   */
  pretty?: boolean;
  plainText?: boolean;
}

export type VariableFormatter = (options: {
  variable: string;
  fallback?: string;
}) => string;
export type VariableValues = Map<string, string>;
export type LinkValues = Map<string, string>;
export type AllowedHeadings = (typeof allowedHeadings)[number];
export type AllowedSpacers = (typeof allowedSpacers)[number];
export type AllowedLogoSizes = (typeof allowedLogoSizes)[number];
