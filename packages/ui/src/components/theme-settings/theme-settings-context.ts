import * as React from 'react';

import { MAILY_UI_NAMESPACE } from '~/utils/constants';

export type ThemeSettingsContext = {
  container: React.RefObject<HTMLElement | null>;
};

export const ThemeSettingsContext =
  React.createContext<ThemeSettingsContext | null>(null);

export function useThemeSettingsContext() {
  const context = React.useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error(
      `${MAILY_UI_NAMESPACE}: ThemeSettingsContext is missing. ThemeSettings parts must be placed within <ThemeSettings.Root>.`
    );
  }

  return context;
}
