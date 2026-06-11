/**
 * Expands a single border-radius value into the four individual
 * corner properties used by v2 nodes: borderTopLeftRadius,
 * borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius.
 * In v1, border radius was stored as a single number; v2 stores
 * each corner independently to support non-uniform rounding.
 */
export function splitBorderRadius(radius: number) {
  return {
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomRightRadius: radius,
    borderBottomLeftRadius: radius,
  };
}

/**
 * Expands a single border-width value into the four individual
 * side properties used by v2 nodes: borderTopWidth, borderRightWidth,
 * borderBottomWidth, borderLeftWidth. In v1, border width was stored
 * as a single number; v2 stores each side independently to support
 * non-uniform borders.
 */
export function splitBorderWidth(width: number) {
  return {
    borderTopWidth: width,
    borderRightWidth: width,
    borderBottomWidth: width,
    borderLeftWidth: width,
  };
}
