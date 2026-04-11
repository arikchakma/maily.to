import { absoluteFromPercentage, is, TEXT_ALIGNMENTS } from '@maily-to/shared';
import { Column as EmailColumn, Row, Section } from '@react-email/components';
import { cloneElement, isValidElement } from 'react';

import { calculateColumnLayout } from '../lib/columns';
import type { NodeRenderer } from '../node';

export const COLUMNS_RESPONSIVE_CSS = /* css */ `@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-gap{display:none!important}}`;

export const columns: NodeRenderer = (node, ctx) => {
  if (!is.columns(node)) {
    return null;
  }

  ctx.style(COLUMNS_RESPONSIVE_CSS);

  const { gap = 0 } = node.attrs;
  const nodes = node.content.filter(is.column);
  const { columns, rowWidthPercent, gapTdWidthPercent } = calculateColumnLayout(
    nodes,
    gap,
    ctx.box
  );

  if (columns.length === 0) {
    return null;
  }

  const width = `${rowWidthPercent}%`;

  return (
    <Section>
      <Row
        className="tab-row-full"
        width={width}
        style={{ width }}
        align={TEXT_ALIGNMENTS.LEFT}
      >
        {columns.flatMap((item, index) => {
          const widthInPixels = absoluteFromPercentage(
            item.containerPercent,
            ctx.box
          );

          const childCtx = ctx.child({
            parent: node,
            siblingIndex: index,
            size: {
              totalWidth: widthInPixels,
              totalBorder: 0,
              totalPadding: 0,
            },
          });

          const tdWidth = `${item.tdWidthPercent}%`;
          childCtx.set('columnTdWidth', tdWidth);
          const el = childCtx.render(item.node);

          const colEl = isValidElement(el)
            ? cloneElement(el, { key: item.node.attrs.id })
            : null;

          const isNotLastColumn = index < columns.length - 1;
          const hasGap = gap > 0;
          const shouldRenderGap = isNotLastColumn && hasGap;
          if (shouldRenderGap) {
            const gapWidth = `${gapTdWidthPercent}%`;
            const gapKey = `gap-${item.node.attrs.id}`;

            return [
              colEl,
              <EmailColumn
                key={gapKey}
                className="tab-gap"
                width={gapWidth}
                style={{ width: gapWidth }}
              />,
            ];
          }

          return [colEl];
        })}
      </Row>
    </Section>
  );
};
