import type { EditorThemeOptions } from '@maily-to/shared';
import * as React from 'react';

import { MAILY_UI_NAMESPACE } from '~/utils/constants';

export type ThemeContext = {
  theme: EditorThemeOptions;
  setTheme: (theme: EditorThemeOptions) => void;
};

export const ThemeContext = React.createContext<ThemeContext | null>(null);

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error(
      `${MAILY_UI_NAMESPACE}: ThemeContext is missing. Components must be placed within <ThemeProvider>.`
    );
  }

  return context;
}
