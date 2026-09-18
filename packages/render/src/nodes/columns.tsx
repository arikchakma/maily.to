import { absoluteFromPercentage, is } from '@maily-to/shared';
import { Column as EmailColumn, Row, Section } from '@react-email/components';
import { Fragment } from 'react';

import { calculateColumnLayout } from '../lib/columns';
import type { NodeRenderer } from '../node';

const COLUMNS_RESPONSIVE_CSS = `@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-gap{display:none!important}}`;

export const columns: NodeRenderer = (node, ctx) => {
  if (!is.columns(node)) {
    return null;
  }

  ctx.style(COLUMNS_RESPONSIVE_CSS);

  const columnNodes = node.content.filter(is.column);
  const { columns, gapTdWidthPercent, rowWidthPercent } = calculateColumnLayout(
    columnNodes,
    node.attrs.gap,
    ctx.box
  );

  if (columns.length === 0) {
    return null;
  }

  const width = `${rowWidthPercent}%`;
  const gapWidth = `${gapTdWidthPercent}%`;

  return (
    <Section>
      <Row
        align="left"
        className="tab-row-full"
        style={{ width }}
        width={width}
      >
        {columns.map((item, index) => {
          const childCtx = ctx.child({
            parent: node,
            siblingIndex: index,
            size: {
              totalWidth: absoluteFromPercentage(
                item.containerPercent,
                ctx.box
              ),
              totalBorder: 0,
              totalPadding: 0,
            },
          });

          childCtx.set('columnWidth', `${item.tdWidthPercent}%`);

          return (
            <Fragment key={index}>
              {childCtx.render(item.node)}
              {node.attrs.gap > 0 && index < columns.length - 1 ? (
                <EmailColumn
                  className="tab-gap"
                  style={{ width: gapWidth }}
                  width={gapWidth}
                />
              ) : null}
            </Fragment>
          );
        })}
      </Row>
    </Section>
  );
};
