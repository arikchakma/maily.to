import type { Properties } from 'csstype';

import type { AllowedFieldMode } from './field-mode';
import { FIELD_MODE } from './field-mode';

/**
 * Per-side padding configuration for a node. Includes a field mode
 * that controls whether padding is edited uniformly or per-side,
 * and individual values for each side in pixels.
 */
export type PaddingStyleConfig = {
  paddingMode: AllowedFieldMode;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
};

/**
 * Converts a PaddingStyleConfig into CSS properties for inline styles.
 * When all sides are equal (or mode is "uniform"), emits shorthand CSS;
 * otherwise emits per-side longhand properties.
 */
export function getPaddingStyle(config: PaddingStyleConfig): Properties {
  const { paddingMode, paddingTop, paddingRight, paddingBottom, paddingLeft } =
    config;

  const isPaddingUniform =
    paddingMode === FIELD_MODE.UNIFORM ||
    (paddingLeft === paddingRight &&
      paddingRight === paddingBottom &&
      paddingBottom === paddingTop);

  if (isPaddingUniform) {
    return { padding: `${paddingTop}px` };
  }

  return {
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
  };
}
