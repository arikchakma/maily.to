import { describe, expect, it } from 'vite-plus/test';

import { parseWidthToPercentage } from '../src/index';

describe('parseWidthToPercentage', () => {
  it('resolves every width the document may hold against its container', () => {
    const resolved = {
      auto: parseWidthToPercentage('auto', 600),
      bareNumber: parseWidthToPercentage(300, 600),
      empty: parseWidthToPercentage(null, 600),
      fraction: parseWidthToPercentage('12.5%', 600),
      percentage: parseWidthToPercentage('50%', 600),
      pixels: parseWidthToPercentage('300px', 600),
      unitless: parseWidthToPercentage('300', 600),
    };

    expect(resolved).toEqual({
      auto: 100,
      bareNumber: 50,
      empty: 100,
      fraction: 12.5,
      percentage: 50,
      pixels: 50,
      unitless: 50,
    });
  });

  it('reads a pixel width against the container it is given', () => {
    expect({
      narrow: parseWidthToPercentage('32px', 320),
      wide: parseWidthToPercentage('32px', 640),
    }).toEqual({ narrow: 10, wide: 5 });
  });

  it('falls back to the full width for a length it cannot measure', () => {
    expect({
      blank: parseWidthToPercentage('', 600),
      calc: parseWidthToPercentage('calc(100% - 20px)', 600),
      em: parseWidthToPercentage('2em', 600),
      onlyUnit: parseWidthToPercentage('px', 600),
      viewport: parseWidthToPercentage('50vw', 600),
    }).toEqual({
      blank: 100,
      calc: 100,
      em: 100,
      onlyUnit: 100,
      viewport: 100,
    });
  });

  it('clamps a resolved width to the range an image may take', () => {
    expect({
      over: parseWidthToPercentage('9999px', 600),
      under: parseWidthToPercentage('1px', 600),
    }).toEqual({ over: 100, under: 5 });
  });
});
