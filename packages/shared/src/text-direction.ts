/** Text direction values matching the HTML `dir` attribute: ltr, rtl, auto. */
export const TEXT_DIRECTIONS = {
  LTR: 'ltr',
  RTL: 'rtl',
  AUTO: 'auto',
} as const;

export type TextDirection =
  (typeof TEXT_DIRECTIONS)[keyof typeof TEXT_DIRECTIONS];

export const allowedTextDirections: readonly TextDirection[] = Object.freeze(
  Object.values(TEXT_DIRECTIONS)
);

export const DEFAULT_TEXT_DIRECTION: TextDirection = TEXT_DIRECTIONS.AUTO;

export function isAllowedTextDirection(value: unknown): value is TextDirection {
  return (
    typeof value === 'string' &&
    allowedTextDirections.includes(value as TextDirection)
  );
}

/**
 * Returns a CSS `direction` property object for the given dir value.
 * Returns an empty object for "auto" or nullish values, since the
 * browser default is sufficient in those cases.
 */
export function getCssDirection(
  dir: TextDirection | null | undefined
): Record<string, Omit<TextDirection, typeof TEXT_DIRECTIONS.AUTO>> {
  if (dir && dir !== TEXT_DIRECTIONS.AUTO) {
    return { direction: dir };
  }

  return {};
}
