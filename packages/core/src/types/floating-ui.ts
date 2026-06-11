import type { FloatingPortalProps } from '@floating-ui/react';

export type FloatingUIContainer = FloatingPortalProps['root'];

/**
 * Stable IDs for each floating bubble menu. Used to register, look up,
 * and coordinate visibility of menus through the floating store.
 */
export const FLOATING_ELEMENT_IDS = {
  TEXT_BUBBLE_MENU: 'text-bubble-menu',
  VARIABLE_BUBBLE_MENU: 'variable-bubble-menu',
  SPACER_BUBBLE_MENU: 'spacer-bubble-menu',
  SECTION_BUBBLE_MENU: 'section-bubble-menu',
  REPEAT_BUBBLE_MENU: 'repeat-bubble-menu',
  COLUMNS_BUBBLE_MENU: 'columns-bubble-menu',
  INLINE_IMAGE_BUBBLE_MENU: 'inline-image-bubble-menu',
  IMAGE_BUBBLE_MENU: 'image-bubble-menu',
  BUTTON_BUBBLE_MENU: 'button-bubble-menu',
  HTML_CODE_BLOCK_BUBBLE_MENU: 'html-code-block-bubble-menu',
  LINK_CARD_BUBBLE_MENU: 'link-card-bubble-menu',
} as const;

export type FloatingElementId =
  (typeof FLOATING_ELEMENT_IDS)[keyof typeof FLOATING_ELEMENT_IDS];

/**
 * Priority order for bubble menu visibility. When multiple menus
 * could be active (e.g. text inside a button inside a section),
 * the first matching menu in this list wins.
 */
export const FLOATING_ELEMENT_ORDER = [
  FLOATING_ELEMENT_IDS.HTML_CODE_BLOCK_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.BUTTON_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.VARIABLE_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.SPACER_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.COLUMNS_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.REPEAT_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.SECTION_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.INLINE_IMAGE_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.IMAGE_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.LINK_CARD_BUBBLE_MENU,
  FLOATING_ELEMENT_IDS.TEXT_BUBBLE_MENU,
] as const;
