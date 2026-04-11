import type { EditorThemeOptions } from '@maily-to/shared';
import { DEFAULT_EDITOR_THEME } from '@maily-to/shared';

import { useControllableState } from '~/hooks/use-controllable-state';

import { ThemeContext } from './theme-context';

type ThemeProviderProps = {
  theme?: EditorThemeOptions;
  defaultTheme?: EditorThemeOptions;
  onThemeChange?: (theme: EditorThemeOptions) => void;
  children: React.ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const { theme: themeProp, defaultTheme, onThemeChange, children } = props;

  const [theme, setTheme] = useControllableState({
    value: themeProp,
    defaultValue: defaultTheme ?? DEFAULT_EDITOR_THEME,
    onChange: onThemeChange,
  });

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
