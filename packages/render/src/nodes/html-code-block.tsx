import type { AnyMailyNode } from '@maily-to/shared';
import { is } from '@maily-to/shared';
import juice from 'juice';
import { parse } from 'node-html-parser';

import type { RenderContext } from '../context';
import { resolveVariableId } from '../lib/resolve-variable';
import { getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

function getResolvedText(node: AnyMailyNode, ctx: RenderContext): string {
  if (is.text(node)) {
    return node.text;
  }

  if (is.variable(node)) {
    const { fallback, id } = node.attrs;

    return id ? resolveVariableId(id, fallback, ctx) : '';
  }

  if (!node.content) {
    return '';
  }

  return node.content
    .map((child) => {
      return getResolvedText(child, ctx);
    })
    .join('');
}

export const htmlCodeBlock: NodeRenderer = (node, ctx) => {
  if (!is.htmlCodeBlock(node)) {
    return null;
  }

  const source = node.content
    ? node.content
        .map((child) => {
          return getResolvedText(child, ctx);
        })
        .join('')
    : '';

  // Email clients drop a <style> block, so juice folds the rules into the
  // elements they match before the head is thrown away.
  const document = parse(juice(source));
  document.querySelector('head')?.remove();

  return (
    <table
      align="left"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={getNodeStyle(node.attrs?.style)}
      width="100%"
    >
      <tbody>
        <tr style={{ width: '100%' }}>
          <td
            dangerouslySetInnerHTML={{ __html: document.toString() }}
            style={{ width: '100%' }}
          />
        </tr>
      </tbody>
    </table>
  );
};
