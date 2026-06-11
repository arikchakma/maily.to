export const TEXT_ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export type AllowedTextAlignment =
  (typeof TEXT_ALIGNMENTS)[keyof typeof TEXT_ALIGNMENTS];

export const allowedTextAligns: readonly AllowedTextAlignment[] = Object.freeze(
  Object.values(TEXT_ALIGNMENTS)
);

export const DEFAULT_TEXT_ALIGN: AllowedTextAlignment = TEXT_ALIGNMENTS.LEFT;

export function isAllowedTextAlignment(
  value: unknown
): value is AllowedTextAlignment {
  return (
    typeof value === 'string' &&
    allowedTextAligns.includes(value as AllowedTextAlignment)
  );
}
