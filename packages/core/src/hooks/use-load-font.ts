import type { FallbackFont, FontFamilyItem } from '@maily-to/shared';
import { loadFont } from '@maily-to/shared';
import { useCallback } from 'react';

const loadedFonts = new Set<string>();

export type LoadFontOptions = {
  fallbackFontFamily: FallbackFont;
  item: FontFamilyItem;
};

export function useLoadFont() {
  return useCallback((options: LoadFontOptions) => {
    const { fallbackFontFamily, item } = options;

    if (!item.webFont || loadedFonts.has(item.fontFamily)) {
      return;
    }

    loadFont({
      fallbackFontFamily,
      fontFamily: item.fontFamily,
      webFont: item.webFont,
    });
    loadedFonts.add(item.fontFamily);
  }, []);
}
