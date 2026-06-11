import { describe, expect, it } from 'vite-plus/test';

import { FIELD_MODE } from './field-mode';
import { getPaddingStyle } from './padding';

describe('getPaddingStyle', () => {
  it('returns shorthand when mode is uniform', () => {
    const result = getPaddingStyle({
      paddingMode: FIELD_MODE.UNIFORM,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    });

    expect(result).toEqual({ padding: '10px' });
  });

  it('returns shorthand when all values are equal (auto-detect)', () => {
    const result = getPaddingStyle({
      paddingMode: FIELD_MODE.MIXED,
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
    });

    expect(result).toEqual({ padding: '16px' });
  });

  it('returns individual properties when values differ', () => {
    const result = getPaddingStyle({
      paddingMode: FIELD_MODE.MIXED,
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: 12,
      paddingLeft: 16,
    });

    expect(result).toEqual({
      paddingTop: '4px',
      paddingRight: '8px',
      paddingBottom: '12px',
      paddingLeft: '16px',
    });
  });
});
