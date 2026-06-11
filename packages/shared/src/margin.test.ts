import { describe, expect, it } from 'vite-plus/test';

import { FIELD_MODE } from './field-mode';
import { getMarginStyle } from './margin';

describe('getMarginStyle', () => {
  it('returns shorthand when mode is uniform', () => {
    const result = getMarginStyle({
      marginMode: FIELD_MODE.UNIFORM,
      marginTop: 10,
      marginRight: 10,
      marginBottom: 10,
      marginLeft: 10,
    });

    expect(result).toEqual({ margin: '10px' });
  });

  it('returns shorthand when all values are equal (auto-detect)', () => {
    const result = getMarginStyle({
      marginMode: FIELD_MODE.MIXED,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20,
    });

    expect(result).toEqual({ margin: '20px' });
  });

  it('returns individual properties when values differ', () => {
    const result = getMarginStyle({
      marginMode: FIELD_MODE.MIXED,
      marginTop: 5,
      marginRight: 10,
      marginBottom: 15,
      marginLeft: 20,
    });

    expect(result).toEqual({
      marginTop: '5px',
      marginRight: '10px',
      marginBottom: '15px',
      marginLeft: '20px',
    });
  });
});
