import type { FontFamilyItem, NodeThemeOptions } from '@maily-to/shared';
import {
  DEFAULT_FONT_FAMILIES,
  serializeVariableToText,
} from '@maily-to/shared';
import type { HtmlProps } from '@react-email/components';
import type { JSONContent } from '@tiptap/core';

import type { MetaDescriptor } from './lib/meta';

/**
 * Custom formatter called when a variable has no value in `variables`.
 * Return a placeholder string (e.g. `{{name}}` or `${name}`).
 */
export type VariableFormatter = (opts: {
  fallback?: string;
  variable: string;
}) => string;

/**
 * Any value that can be stored in the unified `variables` map.
 *
 * - `string` — text substitution (variable nodes, link href overrides)
 * - `number` — numeric comparisons in visibility rules
 * - `boolean` — truthy/falsy visibility checks
 * - `Record<string, unknown>` — nested object data
 * - `VariableValue[]` — arrays iterated by repeat nodes
 */
export type VariableValue =
  | Record<string, unknown>
  | VariableValue[]
  | boolean
  | number
  | string;

/**
 * Public config passed to `render()`.
 *
 * Resolution priority (highest → lowest):
 * 1. `item` — per-iteration data set by repeat nodes (via context)
 * 2. `variables` — this map
 * 3. `variableFormatter` — fallback that produces a placeholder string
 */
export type MailyConfig = {
  fontFamilies?: FontFamilyItem[];
  htmlProps?: HtmlProps;
  meta?: MetaDescriptor[];
  openTrackingPixel?: string;
  preview?: JSONContent | string;
  theme?: NodeThemeOptions;
  variableFormatter?: VariableFormatter;
  variables?: Record<string, VariableValue>;
};

export type BuiltMailyConfig = {
  fontFamilies: FontFamilyItem[];
  htmlProps: HtmlProps;
  meta: MetaDescriptor[];
  openTrackingPixel?: string;
  preview?: JSONContent | string;
  variableFormatter: VariableFormatter;
  variableValues: Map<string, VariableValue>;
};

const DEFAULT_VARIABLE_FORMATTER: VariableFormatter = ({
  fallback,
  variable,
}) => {
  return serializeVariableToText({ fallback, id: variable });
};

export function buildConfig(config: MailyConfig = {}): BuiltMailyConfig {
  return {
    fontFamilies: config.fontFamilies ?? DEFAULT_FONT_FAMILIES,
    htmlProps: config.htmlProps ?? {},
    meta: config.meta ?? [],
    openTrackingPixel: config.openTrackingPixel,
    preview: config.preview,
    variableFormatter: config.variableFormatter ?? DEFAULT_VARIABLE_FORMATTER,
    variableValues: new Map(Object.entries(config.variables ?? {})),
  };
}
