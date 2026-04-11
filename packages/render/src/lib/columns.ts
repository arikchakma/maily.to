import { roundTo } from '@maily-to/shared';
import type { ColumnNode } from '@maily-to/shared';

type ColumnLayout = {
  node: ColumnNode;
  containerPercent: number;
  tdWidthPercent: number;
};

type ColumnLayoutResult = {
  columns: ColumnLayout[];
  rowWidthPercent: number;
  gapTdWidthPercent: number;
};

/**
 * Simulates CSS `flexbox gap` using table-cell percentages.
 *
 * Since tables don't support `gap`, we create empty spacer `<td>` cells
 * between columns. This function calculates how wide each column and
 * spacer should be so the layout behaves similar to flexbox.
 *
 * How the gap affects the layout depends on the column configuration:
 *
 * 1. When there are auto-width columns
 *    The row always fills 100% of the container.
 *    Fixed columns keep their exact width, and auto columns divide
 *    the remaining space after subtracting fixed widths and gaps.
 *
 *    Example:
 *    fixed 40% + auto column, gap 8px in a 600px container
 *    → auto column becomes ~58.667%
 *
 * 2. When all columns have fixed widths and still fit
 *    The row width becomes `fixed widths + gaps`, which may be
 *    smaller than 100%. Columns keep their exact size.
 *
 *    Example:
 *    20% + 20% columns, gap 8px in a 600px container
 *    → row width becomes ~41.333%
 *
 * 3. When all columns are fixed but overflow
 *    If `fixed widths + gaps` exceed 100%, everything is scaled
 *    down proportionally so the row never exceeds the container.
 *
 *    Example:
 *    50% + 50% columns with gap 8px
 *    → both columns shrink to ~49.342%
 */
export function calculateColumnLayout(
  columnNodes: ColumnNode[],
  gap: number,
  containerBox: number
): ColumnLayoutResult {
  const count = columnNodes.length;
  if (count === 0) {
    return { columns: [], rowWidthPercent: 0, gapTdWidthPercent: 0 };
  }

  // Step 1: Convert the gap from pixels into a percentage of the container
  const gapCount = count - 1;
  const gapPercent =
    gapCount > 0 && containerBox > 0
      ? roundTo((gap / containerBox) * 100, 3)
      : 0;
  const totalGapPercent = roundTo(gapCount * gapPercent, 3);

  // Step 2: Separate fixed-width and auto-width columns
  // Fixed columns keep their defined width.
  // Auto columns divide the remaining available space.
  const fixedSum = columnNodes.reduce(
    (sum, col) => sum + (col.attrs.width ?? 0),
    0
  );
  const autoCount = columnNodes.filter(
    (col) => col.attrs.width === null
  ).length;

  const autoEach =
    autoCount > 0
      ? roundTo(Math.max(0, 100 - fixedSum - totalGapPercent) / autoCount, 3)
      : 0;
  let containerPercents = columnNodes.map((col) => col.attrs.width ?? autoEach);

  // Step 3: Calculate the row width
  //
  // If there are auto columns, the row fills the full container (100%).
  // If all columns are fixed, the row width is simply fixedSum + gaps.
  let rowWidthPercent =
    autoCount > 0 ? 100 : roundTo(fixedSum + totalGapPercent, 3);
  let effectiveGapPercent = gapPercent;

  // Step 4: Handle overflow when all columns are fixed
  //
  // If fixed widths + gaps exceed 100%, scale everything down
  // proportionally so the row still fits inside the container.
  if (autoCount === 0 && rowWidthPercent > 100) {
    const scale = 100 / rowWidthPercent;
    containerPercents = containerPercents.map((p) => roundTo(p * scale, 3));
    effectiveGapPercent = roundTo(gapPercent * scale, 3);
    rowWidthPercent = 100;
  }

  // Step 5: Convert container-relative percentages to row-relative ones
  //
  // Table `<td>` width values are relative to the row `<table>`,
  // not the container. If the row is smaller than 100%, the
  // percentages need to be adjusted accordingly.
  const gapTdWidthPercent =
    rowWidthPercent > 0
      ? roundTo((effectiveGapPercent / rowWidthPercent) * 100, 3)
      : 0;

  const columns: ColumnLayout[] = columnNodes.map((col, i) => {
    const containerPercent = containerPercents[i];
    const tdWidthPercent =
      rowWidthPercent > 0
        ? roundTo((containerPercent / rowWidthPercent) * 100, 3)
        : 0;

    return {
      node: {
        ...col,
        attrs: { ...col.attrs, width: col.attrs.width ?? containerPercent },
      },
      containerPercent,
      tdWidthPercent,
    };
  });

  return { columns, rowWidthPercent, gapTdWidthPercent };
}
