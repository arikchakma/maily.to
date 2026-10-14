import {
  buildDocFromVariableText,
  hasVariableInText,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';

import type { RenderContext } from '../context';

/**
 * Resolves a single variable ID using the 3-stage lookup:
 *   1. item (current repeat iteration)
 *   2. variableValues map
 *   3. variableFormatter (fallback)
 */
export function resolveVariableId(
  id: string,
  fallback: string | null | undefined,
  ctx: RenderContext
): string {
  const { config } = ctx;
  const item = ctx.get('item');

  if (item && id in item) {
    return String(item[id]);
  }

  const value = config.variableValues.get(id);
  if (value !== undefined) {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  return config.variableFormatter({
    fallback: fallback ?? undefined,
    variable: id,
  });
}

export function getVariableId(text: string): string | null {
  if (!hasVariableInText(text)) {
    return text.trim() || null;
  }

  const paragraph = buildDocFromVariableText(text).content.find(
    (node) => node.type === MAILY_NODE_TYPES.PARAGRAPH
  );

  for (const node of paragraph?.content ?? []) {
    if (node.type === MAILY_NODE_TYPES.VARIABLE) {
      return node.attrs.id || null;
    }
  }

  return null;
}

type VariableValueOptions = {
  ctx: RenderContext;
  id: string;
};

export function getVariableValue(options: VariableValueOptions): unknown {
  const { ctx, id } = options;
  const item = ctx.get('item');

  return item && id in item ? item[id] : ctx.config.variableValues.get(id);
}

export function getVariableList(each: string, ctx: RenderContext): unknown[] {
  const id = getVariableId(each);
  if (!id) {
    return [];
  }

  const value = getVariableValue({ ctx, id });

  return Array.isArray(value) ? value : [];
}

/**
 * Resolves a text string that may contain `{{variable}}` placeholders.
 * Returns the original string unchanged if no placeholders are present.
 */
export function resolveVariableText(text: string, ctx: RenderContext): string {
  if (!hasVariableInText(text)) {
    return text;
  }

  const paragraph = buildDocFromVariableText(text).content.find(
    (node) => node.type === MAILY_NODE_TYPES.PARAGRAPH
  );
  if (!paragraph) {
    return text;
  }

  return paragraph.content
    .map((node) => {
      if (node.type === MAILY_NODE_TYPES.TEXT) {
        return node.text;
      }

      if (node.type === MAILY_NODE_TYPES.VARIABLE) {
        const { fallback, id } = node.attrs ?? {};

        return id ? resolveVariableId(id, fallback, ctx) : '';
      }

      return '';
    })
    .join('');
}
