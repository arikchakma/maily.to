import { is, isObject } from '@maily-to/shared';
import { Fragment } from 'react';

import { getVariableList } from '../lib/resolve-variable';
import type { NodeRenderer } from '../node';

export const repeat: NodeRenderer = (node, ctx) => {
  if (!is.repeat(node)) {
    return null;
  }

  const { each } = node.attrs;
  const payload = getVariableList(each, ctx);

  return (
    <>
      {payload.map((item, index) => {
        const childContext = ctx.child({ parent: node, siblingIndex: index });
        childContext.set(
          'item',
          isObject(item) ? (item as Record<string, unknown>) : { value: item }
        );

        return <Fragment key={index}>{childContext.children(node)}</Fragment>;
      })}
    </>
  );
};
