const ROOT_WIDTH = 600;
const DEFAULT_COLUMNS_GAP = 8;

/**
 * Parses a v1 column width attribute.
 * Returns the numeric percentage, or `null` for "auto" / unparseable values.
 */
function parseColumnWidth(width: unknown): number | null {
  if (typeof width === 'string') {
    if (width === 'auto') {
      return null;
    }

    const parsed = parseFloat(width);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof width === 'number') {
    return width;
  }

  return null;
}

/**
 * Recursively walks a v1 document tree and stamps `_containerWidth` on every
 * `image` and `logo` node. The value reflects the available content width at
 * that position in the tree, accounting for section padding/border and column
 * percentage widths + gap.
 *
 * Must run **before** the transform walker so the transforms can read
 * `_containerWidth` and convert pixel sizes to accurate percentages.
 */
export function annotateContainerWidths(
  node: Record<string, any>,
  availableWidth: number = ROOT_WIDTH
): void {
  if (!node) {
    return;
  }

  const attrs = node.attrs ?? {};

  // Stamp image and logo nodes
  if (node.type === 'image' || node.type === 'logo') {
    if (!node.attrs) {
      node.attrs = {};
    }
    node.attrs._containerWidth = availableWidth;
  }

  // Narrow available width through sections
  let childWidth = availableWidth;

  if (node.type === 'section') {
    const paddingLeft =
      typeof attrs.paddingLeft === 'number' ? attrs.paddingLeft : 0;
    const paddingRight =
      typeof attrs.paddingRight === 'number' ? attrs.paddingRight : 0;
    const borderWidth =
      typeof attrs.borderWidth === 'number' ? attrs.borderWidth : 0;
    childWidth = availableWidth - paddingLeft - paddingRight - borderWidth * 2;
  }

  // Handle columns → column width narrowing
  if (node.type === 'columns' && Array.isArray(node.content)) {
    const gap = typeof attrs.gap === 'number' ? attrs.gap : DEFAULT_COLUMNS_GAP;
    const columns = node.content;
    const columnCount = columns.length;

    // First pass: figure out how much width is explicitly claimed
    let claimedPercent = 0;
    let autoCount = 0;

    for (const col of columns) {
      const colWidth = parseColumnWidth(col.attrs?.width);
      if (colWidth !== null) {
        claimedPercent += colWidth;
      } else {
        autoCount++;
      }
    }

    // Auto columns split the remaining percentage equally
    const remainingPercent = Math.max(0, 100 - claimedPercent);
    const autoPercent = autoCount > 0 ? remainingPercent / autoCount : 0;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colPercent = parseColumnWidth(col.attrs?.width) ?? autoPercent;

      // Gap: inner columns get gap/2 on each inner side
      // First column: no left gap, gap/2 right
      // Last column: gap/2 left, no right gap
      // Middle columns: gap/2 on both sides
      let gapDeduction = 0;
      if (columnCount > 1) {
        if (i === 0 || i === columnCount - 1) {
          gapDeduction = gap / 2;
        } else {
          gapDeduction = gap;
        }
      }

      const colWidth = childWidth * (colPercent / 100) - gapDeduction;
      annotateContainerWidths(col, Math.max(0, colWidth));
    }

    // Don't recurse into content again — we already handled columns' children
    return;
  }

  // Recurse into children
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      annotateContainerWidths(child, childWidth);
    }
  }
}
