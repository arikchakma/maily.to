/**
 * Controls how multi-value fields (padding, margin, border) are edited.
 * "none" disables the field, "uniform" links all sides to one value,
 * "mixed" allows independent per-side values, "preset" uses predefined
 * size options (e.g. small/medium/large).
 */
export const FIELD_MODE = {
  NONE: 'none',
  MIXED: 'mixed',
  UNIFORM: 'uniform',
  PRESET: 'preset',
} as const;

export type AllowedFieldMode = (typeof FIELD_MODE)[keyof typeof FIELD_MODE];

export const allowedFieldModes = Object.values(
  FIELD_MODE
) as readonly AllowedFieldMode[];

export function isAllowedFieldMode(mode: unknown): mode is AllowedFieldMode {
  return (
    typeof mode === 'string' &&
    allowedFieldModes.includes(mode as AllowedFieldMode)
  );
}
