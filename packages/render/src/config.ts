import {
  DEFAULT_FONT_FAMILIES,
  DEFAULT_RENDERER_THEME,
} from '@maily-to/shared';
import type { FontFamilyItem, RendererThemeOptions } from '@maily-to/shared';
import type { HtmlProps } from '@react-email/components';
import type { JSONContent } from '@tiptap/core';

import type { MetaDescriptor } from './lib/meta';

/**
 * Custom formatter called when a variable has no value in `variables`.
 * Return a placeholder string (e.g. `{{name}}` or `${name}`).
 */
export type VariableFormatter = (opts: {
  variable: string;
  fallback?: string;
}) => string;

/**
 * Any value that can be stored in the unified `variables` map.
 *
 * - `string` — text substitution (variable nodes, link href overrides)
 * - `number` — numeric comparisons in visibility rules
 * - `boolean` — truthy/falsy visibility checks
 * - `Record<string, unknown>` — nested object data
 * - `Array<Record<string, unknown>>` — arrays iterated by repeat nodes
 */
export type VariableValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

/** Internal resolved config produced by buildConfig. */
export type MailyRenderConfig = {
  theme: RendererThemeOptions;
  fontFamilies: FontFamilyItem[];

  variableFormatter: VariableFormatter;
  variableValues: Map<string, VariableValue>;

  preview?: string | JSONContent;
  meta: MetaDescriptor[];
  htmlProps: HtmlProps;
  openTrackingPixel?: string;
};

/**
 * Public config passed to `render()`.
 *
 * All user-provided data lives under a single `variables` key:
 *
 * @example
 * ```ts
 *   render(json, {
 *     variables: {
 *       name: 'Alice',              // string → variable substitution
 *       active: true,               // boolean → visibility rules
 *       items: [{ id: 1 }],         // array → repeat iteration
 *       cta: 'https://example.com', // string → link href override
 *     },
 *   });
 * ```
 *
 * Resolution priority (highest → lowest):
 * 1. `item` — per-iteration data set by repeat nodes (via context)
 * 2. `variables` — this map
 * 3. `variableFormatter` — fallback that produces a placeholder string
 */
export type MailyConfig = {
  preview?: string | JSONContent;
  theme?: Partial<RendererThemeOptions>;
  fontFamilies?: FontFamilyItem[];
  variables?: Record<string, VariableValue>;
  variableFormatter?: VariableFormatter;
  meta?: MetaDescriptor[];
  htmlProps?: HtmlProps;
  openTrackingPixel?: string;
};

const DEFAULT_VARIABLE_FORMATTER: VariableFormatter = ({
  variable,
  fallback,
}) => {
  return fallback ? `{{${variable}|${fallback}}}` : `{{${variable}}}`;
};

/**
 * Merges user-provided MailyConfig with defaults to produce the
 * internal MailyRenderConfig used throughout the render pass.
 */
export function buildConfig(config: MailyConfig = {}): MailyRenderConfig {
  const theme: RendererThemeOptions = {
    ...DEFAULT_RENDERER_THEME,
    ...config.theme,
    paragraph: {
      ...DEFAULT_RENDERER_THEME.paragraph,
      ...config.theme?.paragraph,
    },
    heading: {
      defaults: {
        ...DEFAULT_RENDERER_THEME.heading?.defaults,
        ...config.theme?.heading?.defaults,
      },
      h1: {
        ...DEFAULT_RENDERER_THEME.heading?.h1,
        ...config.theme?.heading?.h1,
      },
      h2: {
        ...DEFAULT_RENDERER_THEME.heading?.h2,
        ...config.theme?.heading?.h2,
      },
      h3: {
        ...DEFAULT_RENDERER_THEME.heading?.h3,
        ...config.theme?.heading?.h3,
      },
    },
    footer: {
      ...DEFAULT_RENDERER_THEME.footer,
      ...config.theme?.footer,
    },
    blockquote: {
      ...DEFAULT_RENDERER_THEME.blockquote,
      ...config.theme?.blockquote,
    },
    horizontalRule: {
      ...DEFAULT_RENDERER_THEME.horizontalRule,
      ...config.theme?.horizontalRule,
    },
    code: {
      ...DEFAULT_RENDERER_THEME.code,
      ...config.theme?.code,
    },
    linkCard: {
      ...DEFAULT_RENDERER_THEME.linkCard,
      ...config.theme?.linkCard,
    },
    container: {
      ...DEFAULT_RENDERER_THEME.container,
      ...config.theme?.container,
    },
    body: {
      ...DEFAULT_RENDERER_THEME.body,
      ...config.theme?.body,
    },
    button: {
      ...DEFAULT_RENDERER_THEME.button,
      ...config.theme?.button,
    },
    link: {
      ...DEFAULT_RENDERER_THEME.link,
      ...config.theme?.link,
    },
    font:
      config.theme?.font !== undefined
        ? config.theme.font
        : DEFAULT_RENDERER_THEME.font,
    listMarker: {
      ...DEFAULT_RENDERER_THEME.listMarker,
      ...config.theme?.listMarker,
    },
  };

  return {
    theme,
    fontFamilies: config.fontFamilies ?? DEFAULT_FONT_FAMILIES,
    variableValues: new Map(Object.entries(config.variables ?? {})),
    variableFormatter: config.variableFormatter ?? DEFAULT_VARIABLE_FORMATTER,
    preview: config.preview,
    meta: config.meta ?? [],
    htmlProps: config.htmlProps ?? {},
    openTrackingPixel: config.openTrackingPixel,
  };
}
