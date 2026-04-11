import { is, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { AnyMailyNode } from '@maily-to/shared';
import juice from 'juice';
import { parse } from 'node-html-parser';

import type { RenderContext } from '../context';
import { resolveVariableId } from '../lib/resolve-variable';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import type { NodeRenderer } from '../node';

function resolveText(node: AnyMailyNode, ctx: RenderContext): string {
  if (node.type === MAILY_NODE_TYPES.TEXT && 'text' in node) {
    return node.text;
  }

  if (node.type === MAILY_NODE_TYPES.VARIABLE && 'attrs' in node) {
    const { id, fallback } = node.attrs;
    if (!id) {
      return '';
    }

    return resolveVariableId(id, fallback, ctx);
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child) => resolveText(child, ctx)).join('');
  }

  return '';
}

export const htmlCodeBlock: NodeRenderer = (node, ctx) => {
  if (!is.htmlCodeBlock(node)) {
    return null;
  }

  const rawHtml = node.content
    ? node.content.reduce((acc, child) => acc + resolveText(child, ctx), '')
    : '';

  const inlined = juice(rawHtml);
  const doc = parse(inlined);
  doc.querySelector('head')?.remove();
  const html = doc.toString();

  return (
    <table
      align="left"
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{ marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 32 }}
    >
      <tbody>
        <tr style={{ width: '100%' }}>
          <td
            style={{ width: '100%' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </tr>
      </tbody>
    </table>
  );
};
