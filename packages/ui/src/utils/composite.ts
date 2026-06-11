export const ARROW_UP = 'ArrowUp';
export const ARROW_DOWN = 'ArrowDown';
export const ARROW_LEFT = 'ArrowLeft';
export const ARROW_RIGHT = 'ArrowRight';
export const HOME = 'Home';
export const END = 'End';
export const PAGE_UP = 'PageUp';
export const PAGE_DOWN = 'PageDown';

export const SHIFT = 'Shift' as const;
export const ENTER = 'Enter' as const;

export const HORIZONTAL_KEYS = new Set([ARROW_LEFT, ARROW_RIGHT]);
export const HORIZONTAL_KEYS_WITH_EXTRA_KEYS = new Set([
  ARROW_LEFT,
  ARROW_RIGHT,
  HOME,
  END,
]);

export const COMPOSITE_KEYS = new Set([
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  HOME,
  END,
]);
