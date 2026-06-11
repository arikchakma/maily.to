import type { FontFamilyItem } from '@maily-to/shared';
import { loadFont as injectFontFace } from '@maily-to/shared';
import type { FallbackFont } from '@maily-to/shared';
import { useCallback } from 'react';

const loadedFonts = new Set<string>();

export function useLoadFont() {
  return useCallback(
    (item: FontFamilyItem, fallbackFontFamily: FallbackFont) => {
      if (!item.webFont || loadedFonts.has(item.fontFamily)) {
        return;
      }

      injectFontFace({
        fontFamily: item.fontFamily,
        fallbackFontFamily,
        webFont: item.webFont,
      });
      loadedFonts.add(item.fontFamily);
    },
    []
  );
}
