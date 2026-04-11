import { describe, expect, it } from 'vite-plus/test';

import { getBorderStyle } from './border';
import { FIELD_MODE } from './field-mode';

describe('getBorderStyle', () => {
  it('returns shorthand border when width mode is uniform', () => {
    const result = getBorderStyle({
      borderStyle: 'solid',
      borderColor: '#ff0000',
      borderWidthMode: FIELD_MODE.UNIFORM,
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRadiusMode: FIELD_MODE.UNIFORM,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    });

    expect(result).toEqual({
      border: '2px solid #ff0000',
      borderRadius: '4px',
    });
  });

  it('returns shorthand border when all widths are equal (auto-detect)', () => {
    const result = getBorderStyle({
      borderStyle: 'dashed',
      borderColor: '#000000',
      borderWidthMode: FIELD_MODE.MIXED,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderRadiusMode: FIELD_MODE.MIXED,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    });

    expect(result).toEqual({
      border: '3px dashed #000000',
      borderRadius: '8px',
    });
  });

  it('returns individual widths when mixed and values differ', () => {
    const result = getBorderStyle({
      borderStyle: 'solid',
      borderColor: '#000000',
      borderWidthMode: FIELD_MODE.MIXED,
      borderTopWidth: 1,
      borderRightWidth: 2,
      borderBottomWidth: 3,
      borderLeftWidth: 4,
      borderRadiusMode: FIELD_MODE.UNIFORM,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    });

    expect(result).toEqual({
      borderTopWidth: '1px',
      borderRightWidth: '2px',
      borderBottomWidth: '3px',
      borderLeftWidth: '4px',
      borderStyle: 'solid',
      borderColor: '#000000',
      borderRadius: '0px',
    });
  });

  it('returns individual border-radius values when mixed and values differ', () => {
    const result = getBorderStyle({
      borderStyle: 'solid',
      borderColor: '#000000',
      borderWidthMode: FIELD_MODE.UNIFORM,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRadiusMode: FIELD_MODE.MIXED,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 16,
    });

    expect(result).toEqual({
      border: '1px solid #000000',
      borderRadius: '4px 8px 12px 16px',
    });
  });
});
