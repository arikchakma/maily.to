export const TEXT_DIRECTIONS = {
  LTR: 'ltr',
  RTL: 'rtl',
  AUTO: 'auto',
} as const;

export type TextDirection =
  (typeof TEXT_DIRECTIONS)[keyof typeof TEXT_DIRECTIONS];

export const DEFAULT_TEXT_DIRECTION: TextDirection = TEXT_DIRECTIONS.AUTO;

export function getCssDirection(dir: TextDirection | null | undefined) {
  if (dir && dir !== TEXT_DIRECTIONS.AUTO) {
    return { direction: dir };
  }

  return {};
}
