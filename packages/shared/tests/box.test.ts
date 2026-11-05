import { describe, expect, it } from 'vite-plus/test';

import {
  getBoxCorners,
  getBoxSides,
  toBoxCorners,
  toBoxSides,
} from '../src/index';

describe('box', () => {
  describe('sides', () => {
    it('reads every side from a padding shorthand', () => {
      expect(getBoxSides({ padding: '10px 32px' }, 'padding')).toEqual({
        bottom: 10,
        left: 32,
        right: 32,
        top: 10,
      });

      expect(getBoxSides({ padding: '1px 2px 3px 4px' }, 'padding')).toEqual({
        bottom: 3,
        left: 4,
        right: 2,
        top: 1,
      });

      expect(getBoxSides({ padding: '5px' }, 'padding')).toEqual({
        bottom: 5,
        left: 5,
        right: 5,
        top: 5,
      });
    });

    it('prefers a longhand side over the shorthand', () => {
      expect(
        getBoxSides({ padding: '10px', paddingLeft: '40px' }, 'padding')
      ).toEqual({ bottom: 10, left: 40, right: 10, top: 10 });
    });

    it('falls back to zero when a box property is absent', () => {
      expect(getBoxSides({}, 'margin')).toEqual({
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      });
    });

    it('collapses equal sides into the shortest shorthand', () => {
      expect(
        toBoxSides('padding', { bottom: 8, left: 8, right: 8, top: 8 })
      ).toEqual({
        padding: '8px',
        paddingBottom: null,
        paddingLeft: null,
        paddingRight: null,
        paddingTop: null,
      });

      expect(
        toBoxSides('padding', { bottom: 10, left: 32, right: 32, top: 10 })
      ).toEqual({
        padding: '10px 32px',
        paddingBottom: null,
        paddingLeft: null,
        paddingRight: null,
        paddingTop: null,
      });

      expect(
        toBoxSides('padding', { bottom: 3, left: 4, right: 2, top: 1 })
      ).toEqual({
        padding: '1px 2px 3px 4px',
        paddingBottom: null,
        paddingLeft: null,
        paddingRight: null,
        paddingTop: null,
      });
    });
  });

  it('reads and writes border radius corners', () => {
    expect(getBoxCorners({ borderRadius: '4px 8px' }, 'borderRadius')).toEqual({
      bottomLeft: 8,
      bottomRight: 4,
      topLeft: 4,
      topRight: 8,
    });

    expect(
      toBoxCorners('borderRadius', {
        bottomLeft: 6,
        bottomRight: 6,
        topLeft: 6,
        topRight: 6,
      })
    ).toEqual({
      borderBottomLeftRadius: null,
      borderBottomRightRadius: null,
      borderRadius: '6px',
      borderTopLeftRadius: null,
      borderTopRightRadius: null,
    });
  });
});
