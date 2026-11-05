import { describe, expect, it } from 'vite-plus/test';

import type { NodeThemeOptions } from '../src/index';
import { extendNodeTheme } from '../src/index';

describe('extendNodeTheme', () => {
  it('extends a node theme without mutating its preset', () => {
    const preset: NodeThemeOptions = {
      paragraph: {
        color: '#18181b',
        fontSize: '14px',
      },
      table: {
        width: '100%',
      },
    };
    const original = structuredClone(preset);
    const theme = extendNodeTheme({
      extension: {
        paragraph: {
          color: '#7c3aed',
        },
      },
      preset: preset,
    });

    expect({ preset, theme }).toEqual({
      preset: original,
      theme: {
        paragraph: {
          color: '#7c3aed',
          fontSize: '14px',
        },
        table: {
          width: '100%',
        },
      },
    });
  });
});
