import type { ColumnNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { calculateColumnLayout } from './columns';

function makeColumn(width: number | null): ColumnNode {
  return {
    type: 'column',
    attrs: { width },
  } as ColumnNode;
}

describe('calculateColumnLayout', () => {
  it('returns empty result for no columns', () => {
    const result = calculateColumnLayout([], 0, 600);

    expect(result.columns).toEqual([]);
    expect(result.rowWidthPercent).toBe(0);
    expect(result.gapTdWidthPercent).toBe(0);
  });

  it('auto + auto: each auto column splits remaining after gap', () => {
    const result = calculateColumnLayout(
      [makeColumn(null), makeColumn(null)],
      8,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.gapTdWidthPercent).toBe(1.333);
    expect(result.columns[0].containerPercent).toBe(49.334);
    expect(result.columns[1].containerPercent).toBe(49.334);
    expect(result.columns[0].tdWidthPercent).toBe(49.334);
    expect(result.columns[1].tdWidthPercent).toBe(49.334);

    const sum =
      result.columns[0].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[1].tdWidthPercent;
    expect(sum).toBeCloseTo(100, 1);
  });

  it('fixed + auto: fixed column keeps exact size, auto absorbs gap', () => {
    const result = calculateColumnLayout(
      [makeColumn(40), makeColumn(null)],
      8,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.gapTdWidthPercent).toBe(1.333);
    expect(result.columns[0].containerPercent).toBe(40);
    expect(result.columns[1].containerPercent).toBe(58.667);
    expect(result.columns[0].tdWidthPercent).toBe(40);
    expect(result.columns[1].tdWidthPercent).toBe(58.667);

    const sum =
      result.columns[0].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[1].tdWidthPercent;
    expect(sum).toBeCloseTo(100, 1);
  });

  it('three auto columns with gap', () => {
    const result = calculateColumnLayout(
      [makeColumn(null), makeColumn(null), makeColumn(null)],
      12,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.gapTdWidthPercent).toBe(2);
    expect(result.columns[0].containerPercent).toBe(32);
    expect(result.columns[1].containerPercent).toBe(32);
    expect(result.columns[2].containerPercent).toBe(32);

    const sum =
      result.columns[0].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[1].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[2].tdWidthPercent;
    expect(sum).toBeCloseTo(100, 1);
  });

  it('20% + 20%: all fixed, row = fixedSum + gap', () => {
    const result = calculateColumnLayout(
      [makeColumn(20), makeColumn(20)],
      8,
      600
    );

    expect(result.rowWidthPercent).toBe(41.333);
    expect(result.gapTdWidthPercent).toBe(3.225);
    expect(result.columns[0].tdWidthPercent).toBe(48.387);
    expect(result.columns[1].tdWidthPercent).toBe(48.387);
    expect(result.columns[0].containerPercent).toBe(20);
    expect(result.columns[1].containerPercent).toBe(20);

    const sum =
      result.columns[0].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[1].tdWidthPercent;
    expect(sum).toBeCloseTo(100, 1);
  });

  it('50% + 50%: all fixed, scales down to fit 100%', () => {
    const result = calculateColumnLayout(
      [makeColumn(50), makeColumn(50)],
      8,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.columns[0].containerPercent).toBeCloseTo(49.342, 2);
    expect(result.columns[1].containerPercent).toBeCloseTo(49.342, 2);
    expect(result.gapTdWidthPercent).toBeCloseTo(1.316, 2);

    const sum =
      result.columns[0].tdWidthPercent +
      result.gapTdWidthPercent +
      result.columns[1].tdWidthPercent;
    expect(sum).toBeCloseTo(100, 1);
  });

  it('no gap: td widths equal container widths', () => {
    const result = calculateColumnLayout(
      [makeColumn(50), makeColumn(50)],
      0,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.gapTdWidthPercent).toBe(0);
    expect(result.columns[0].tdWidthPercent).toBe(50);
    expect(result.columns[1].tdWidthPercent).toBe(50);
  });

  it('auto + auto with no gap: each gets 50%', () => {
    const result = calculateColumnLayout(
      [makeColumn(null), makeColumn(null)],
      0,
      600
    );

    expect(result.rowWidthPercent).toBe(100);
    expect(result.columns[0].containerPercent).toBe(50);
    expect(result.columns[1].containerPercent).toBe(50);
  });

  it('single column (auto): no gap, 100%', () => {
    const result = calculateColumnLayout([makeColumn(null)], 8, 600);

    expect(result.columns).toHaveLength(1);
    expect(result.rowWidthPercent).toBe(100);
    expect(result.gapTdWidthPercent).toBe(0);
    expect(result.columns[0].containerPercent).toBe(100);
    expect(result.columns[0].tdWidthPercent).toBe(100);
  });

  it('single column (fixed 40%): no gap, row = 40%', () => {
    const result = calculateColumnLayout([makeColumn(40)], 8, 600);

    expect(result.rowWidthPercent).toBe(40);
    expect(result.gapTdWidthPercent).toBe(0);
    expect(result.columns[0].containerPercent).toBe(40);
    expect(result.columns[0].tdWidthPercent).toBe(100);
  });

  it('does not mutate the original column nodes', () => {
    const original = makeColumn(null);
    const cols = [original, makeColumn(null)];
    calculateColumnLayout(cols, 0, 600);

    expect(original.attrs.width).toBeNull();
  });

  it('resolved width on node: auto columns get containerPercent', () => {
    const result = calculateColumnLayout(
      [makeColumn(40), makeColumn(null)],
      8,
      600
    );

    expect(result.columns[0].node.attrs.width).toBe(40);
    expect(result.columns[1].node.attrs.width).toBe(58.667);
  });
});
