import { describe, expect, it } from 'vite-plus/test';

import { isAllowedTextAlignment, TEXT_ALIGNMENTS } from './alignment';

describe('isAllowedTextAlignment', () => {
  it('returns true for "left"', () => {
    expect(isAllowedTextAlignment(TEXT_ALIGNMENTS.LEFT)).toBe(true);
  });

  it('returns true for "center"', () => {
    expect(isAllowedTextAlignment(TEXT_ALIGNMENTS.CENTER)).toBe(true);
  });

  it('returns true for "right"', () => {
    expect(isAllowedTextAlignment(TEXT_ALIGNMENTS.RIGHT)).toBe(true);
  });

  it('returns false for "justify"', () => {
    expect(isAllowedTextAlignment('justify')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isAllowedTextAlignment('')).toBe(false);
  });
});
