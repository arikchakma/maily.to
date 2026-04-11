/**
 * Numeric font weight values mapped to semantic names.
 * Normal (400), Medium (500), Semibold (600), Bold (700), Extra Bold (800).
 */
export const FONT_WEIGHTS = {
  NORMAL: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
} as const;

export type FontWeight = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];
