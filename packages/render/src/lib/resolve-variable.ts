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

  const varValue = config.variableValues.get(id);
  if (varValue !== undefined) {
    if (typeof varValue === 'object') {
      return JSON.stringify(varValue);
    }
    return String(varValue);
  }

  return config.variableFormatter({
    variable: id,
    fallback: fallback ?? undefined,
  });
}

/**
 * Resolves a text string that may contain `{{variable}}` placeholders.
 * Returns the original string unchanged if no placeholders are present.
 */
export function resolveVariableText(text: string, ctx: RenderContext): string {
  if (!hasVariableInText(text)) {
    return text;
  }

  const doc = buildDocFromVariableText(text);
  const paragraph = doc.content.find(
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
        const { id, fallback } = node.attrs;
        if (!id) {
          return '';
        }

        return resolveVariableId(id, fallback, ctx);
      }

      return '';
    })
    .join('');
}
