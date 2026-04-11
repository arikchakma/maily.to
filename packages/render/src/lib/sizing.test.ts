import { describe, expect, it } from 'vite-plus/test';

import { initSize, insetBox, narrowBoxByPercent, parsePxValue } from './sizing';

describe('parsePxValue', () => {
  it('returns 0 for undefined', () => {
    expect(parsePxValue(undefined)).toBe(0);
  });

  it('returns the number directly for numeric input', () => {
    expect(parsePxValue(10)).toBe(10);
    expect(parsePxValue(0)).toBe(0);
  });

  it('parses px strings', () => {
    expect(parsePxValue('16px')).toBe(16);
    expect(parsePxValue('3.5px')).toBe(3.5);
  });

  it('handles whitespace in px strings', () => {
    expect(parsePxValue('  12px  ')).toBe(12);
  });

  it('returns 0 for non-px strings', () => {
    expect(parsePxValue('10em')).toBe(0);
    expect(parsePxValue('50%')).toBe(0);
    expect(parsePxValue('auto')).toBe(0);
  });
});

describe('initSize', () => {
  it('creates size with total width and zero insets', () => {
    const size = initSize(600);

    expect(size).toEqual({
      totalWidth: 600,
      totalBorder: 0,
      totalPadding: 0,
    });
  });
});

describe('insetBox', () => {
  it('subtracts padding and border from box', () => {
    const base = initSize(600);
    const result = insetBox(base, {
      paddingLeft: '20px',
      paddingRight: '20px',
      borderLeft: '1px',
      borderRight: '1px',
    });

    expect(result.totalWidth).toBe(600);
    expect(result.totalBorder).toBe(2);
    expect(result.totalPadding).toBe(40);
  });

  it('accumulates insets from multiple calls', () => {
    const base = initSize(600);
    const first = insetBox(base, {
      paddingLeft: '10px',
      paddingRight: '10px',
      borderLeft: '2px',
      borderRight: '2px',
    });
    const second = insetBox(first, {
      paddingLeft: '5px',
      paddingRight: '5px',
      borderLeft: undefined,
      borderRight: undefined,
    });

    expect(second.totalWidth).toBe(600);
    expect(second.totalBorder).toBe(4);
    expect(second.totalPadding).toBe(30);
  });

  it('handles numeric values as 0 (only string px)', () => {
    const base = initSize(600);
    const result = insetBox(base, {
      paddingLeft: 10,
      paddingRight: 10,
      borderLeft: undefined,
      borderRight: undefined,
    });

    // box = 600 - 0 - 20 = 580
    expect(result.totalWidth).toBe(600);
    expect(result.totalPadding).toBe(20);
  });
});

describe('narrowBoxByPercent', () => {
  it('narrows box by percentage minus gap', () => {
    const base = initSize(600);
    const result = narrowBoxByPercent(base, 50, 10);

    expect(result.totalWidth).toBe(290);
    expect(result.totalBorder).toBe(0);
    expect(result.totalPadding).toBe(0);
  });

  it('narrows to full width with 100% and no gap', () => {
    const base = initSize(600);
    const result = narrowBoxByPercent(base, 100, 0);

    expect(result.totalWidth).toBe(600);
  });
});
