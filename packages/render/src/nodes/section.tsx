import {
  getBorderStyle,
  getMarginStyle,
  getPaddingStyle,
  is,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { Column, Row } from '@react-email/components';

import { insetBox } from '../lib/sizing';
import { shouldShow } from '../lib/visibility';
import type { NodeRenderer } from '../node';

export const section: NodeRenderer = (node, ctx) => {
  if (!is.section(node)) {
    return null;
  }

  if (!shouldShow(node, ctx)) {
    return null;
  }

  const { backgroundColor, align } = node.attrs;

  const borderStyle = getBorderStyle(node.attrs);
  const paddingStyle = getPaddingStyle(node.attrs);
  const marginStyle = getMarginStyle(node.attrs);

  const size = insetBox(ctx.size, {
    paddingLeft: node.attrs.paddingLeft,
    paddingRight: node.attrs.paddingRight,
    borderLeft: node.attrs.borderLeftWidth,
    borderRight: node.attrs.borderRightWidth,
  });

  return (
    <Row style={marginStyle}>
      <Column
        align={align ?? TEXT_ALIGNMENTS.LEFT}
        style={{
          backgroundColor,
          ...borderStyle,
          ...paddingStyle,
        }}
      >
        {ctx.child({ size }).children(node)}
      </Column>
    </Row>
  );
};
