import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import { createContext, use } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

type ToolbarContext = {
  container: FloatingUIContainer;
};

const ToolbarContext = createContext<ToolbarContext | null>(null);

export function useToolbarContext() {
  const context = use(ToolbarContext);
  if (!context) {
    throw new Error(
      `${MAILY_ERROR_PREFIX}: ToolbarContext is missing. Toolbar parts must be placed within <Toolbar.Root>.`
    );
  }

  return context;
}

export { ToolbarContext };
