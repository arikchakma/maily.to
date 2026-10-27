import { describe, expect, it } from 'vite-plus/test';

import { getBorderParts, isAllowedBorderStyle } from '../src/index';

describe('border', () => {
  describe('getBorderParts', () => {
    it('splits a border shorthand into its parts', () => {
      expect(getBorderParts({ border: '2px solid #e2e2e2' })).toEqual({
        color: '#e2e2e2',
        style: 'solid',
        width: '2px',
      });
    });

    it('prefers longhands over the shorthand', () => {
      expect(
        getBorderParts({
          border: '2px solid #e2e2e2',
          borderColor: '#ff0000',
          borderStyle: 'dashed',
        })
      ).toEqual({ color: '#ff0000', style: 'dashed', width: '2px' });
    });

    it('returns empty parts when no border is set', () => {
      expect(getBorderParts({})).toEqual({
        color: undefined,
        style: undefined,
        width: undefined,
      });
    });
  });

  it('recognises the supported border styles', () => {
    expect(isAllowedBorderStyle('dotted')).toBe(true);
    expect(isAllowedBorderStyle('groove')).toBe(false);
  });
});
