import type { Properties } from 'csstype';

import type { AllowedFieldMode } from './field-mode';
import { FIELD_MODE } from './field-mode';

/**
 * Per-side margin configuration for a node. Includes a field mode
 * that controls whether margin is edited uniformly or per-side,
 * and individual values for each side in pixels.
 */
export type MarginStyleConfig = {
  marginMode: AllowedFieldMode;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

/**
 * Converts a MarginStyleConfig into CSS properties for inline styles.
 * When all sides are equal (or mode is "uniform"), emits shorthand CSS;
 * otherwise emits per-side longhand properties.
 */
export function getMarginStyle(config: MarginStyleConfig): Properties {
  const { marginMode, marginTop, marginRight, marginBottom, marginLeft } =
    config;

  const isMarginUniform =
    marginMode === FIELD_MODE.UNIFORM ||
    (marginLeft === marginRight &&
      marginRight === marginBottom &&
      marginBottom === marginTop);

  if (isMarginUniform) {
    return { margin: `${marginTop}px` };
  }

  return {
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
  };
}
