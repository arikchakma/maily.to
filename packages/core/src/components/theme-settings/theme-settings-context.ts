import { invariant } from '@maily-to/shared';
import { createContext, use } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

type ThemeSettingsContext = {
  container: FloatingUIContainer;
};

const ThemeSettingsContext = createContext<ThemeSettingsContext | null>(null);

export function useThemeSettingsContext() {
  const context = use(ThemeSettingsContext);
  invariant(
    context,
    'ThemeSettingsContext is missing. Theme settings parts must be placed within <ThemeSettings.Root>.'
  );

  return context;
}

export { ThemeSettingsContext };
