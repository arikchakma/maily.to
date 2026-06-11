/**
 * Button layout kinds.
 * "tight" renders the button at its content width,
 * "full-width" stretches it to fill the container.
 */
export const BUTTON_KINDS = {
  TIGHT: 'tight',
  FULL_WIDTH: 'full-width',
} as const;

export type AllowedButtonKind =
  (typeof BUTTON_KINDS)[keyof typeof BUTTON_KINDS];

export const allowedButtonKinds: readonly AllowedButtonKind[] = Object.freeze(
  Object.values(BUTTON_KINDS)
);

export const DEFAULT_BUTTON_KIND: AllowedButtonKind = BUTTON_KINDS.TIGHT;

export function isAllowedButtonKind(
  value: unknown
): value is AllowedButtonKind {
  return (
    typeof value === 'string' &&
    allowedButtonKinds.includes(value as AllowedButtonKind)
  );
}
