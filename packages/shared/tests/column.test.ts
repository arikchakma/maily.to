import {
  getColumnWidth,
  getColumnWidthPercent,
  getColumnWidthValue,
} from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

describe('column width', () => {
  describe('getColumnWidth', () => {
    it('reads a percentage width as a number', () => {
      expect([getColumnWidth('50%'), getColumnWidth(' 33.5% ')]).toEqual([
        50, 33.5,
      ]);
    });

    it('keeps a width the editor cannot express as a percentage', () => {
      expect([
        getColumnWidth('200px'),
        getColumnWidth('12em'),
        getColumnWidth('4rem'),
      ]).toEqual(['200px', '12em', '4rem']);
    });

    it('reads no width from an empty or unusable declaration', () => {
      expect([
        getColumnWidth(''),
        getColumnWidth(null),
        getColumnWidth(undefined),
        getColumnWidth('auto'),
        getColumnWidth('calc(100% - 8px)'),
      ]).toEqual([null, null, null, null, null]);
    });
  });

  describe('getColumnWidthPercent', () => {
    it('resolves a percentage or pixel width against the container', () => {
      expect([
        getColumnWidthPercent({ containerWidth: 600, width: 40 }),
        getColumnWidthPercent({ containerWidth: 600, width: '25%' }),
        getColumnWidthPercent({ containerWidth: 600, width: '200px' }),
      ]).toEqual([40, 25, 33.333]);
    });

    it('resolves nothing for a width no container can measure', () => {
      expect([
        getColumnWidthPercent({ containerWidth: 600, width: '12em' }),
        getColumnWidthPercent({ containerWidth: 0, width: '200px' }),
        getColumnWidthPercent({ containerWidth: 600, width: null }),
      ]).toEqual([null, null, null]);
    });
  });

  it('writes a number back as a percentage and a string as it stands', () => {
    expect([getColumnWidthValue(40), getColumnWidthValue('200px')]).toEqual([
      '40%',
      '200px',
    ]);
  });
});
