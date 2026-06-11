import { describe, expect, it } from 'vite-plus/test';

import { clamp, percentage, roundTo } from './math';

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, [0, 10])).toBe(5);
  });

  it('clamps to min when value is below range', () => {
    expect(clamp(-5, [0, 10])).toBe(0);
  });

  it('clamps to max when value is above range', () => {
    expect(clamp(15, [0, 10])).toBe(10);
  });

  it('returns min when min equals max', () => {
    expect(clamp(5, [3, 3])).toBe(3);
  });
});

describe('percentage', () => {
  it('calculates correct percentage', () => {
    expect(percentage(50, 200)).toBe(25);
  });

  it('clamps to 0 for negative portion', () => {
    expect(percentage(-10, 100)).toBe(0);
  });

  it('clamps to 100 when portion exceeds total', () => {
    expect(percentage(200, 100)).toBe(100);
  });
});

describe('roundTo', () => {
  it('rounds to specified decimal places', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });

  it('rounds to zero decimal places', () => {
    expect(roundTo(3.7, 0)).toBe(4);
  });

  it('handles rounding up', () => {
    expect(roundTo(2.555, 2)).toBe(2.56);
  });
});
