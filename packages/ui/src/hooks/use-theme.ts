import type { EditorThemeOptions } from '@maily-to/shared';
import { DEFAULT_EDITOR_THEME, deepMerge } from '@maily-to/shared';
import { useCallback, useMemo } from 'react';

import { useThemeContext } from '~/components/theme-provider/theme-context';

type ResolvedEditorTheme = EditorThemeOptions &
  Required<Pick<EditorThemeOptions, 'container' | 'body' | 'button' | 'link'>>;

type UpdateThemeFunc = (
  updater:
    | Partial<EditorThemeOptions>
    | ((prev: EditorThemeOptions) => EditorThemeOptions)
) => void;

export function useTheme() {
  const { theme: rawTheme, setTheme } = useThemeContext();

  const theme = useMemo(
    () => deepMerge(DEFAULT_EDITOR_THEME, rawTheme) as ResolvedEditorTheme,
    [rawTheme]
  );

  const updateTheme: UpdateThemeFunc = useCallback(
    (updater) => {
      if (typeof updater === 'function') {
        setTheme(updater(rawTheme));
        return;
      }

      setTheme(deepMerge(rawTheme, updater));
    },
    [rawTheme, setTheme]
  );

  return { theme, updateTheme };
}
