import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { MAILY_EXTENSION_TYPES } from '@maily-to/shared';
import { useMemo, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { TooltipProvider } from '../interface/tooltip';
import { ThemeSettingsContext } from './theme-settings-context';

export type ThemeSettingsRootProps = ToolbarPrimitive.Root.Props;

export function ThemeSettingsRoot(props: ThemeSettingsRootProps) {
  const { children, ...rest } = props;

  const editor = useEditorInstance();
  const container = useRef<HTMLDivElement>(null);
  const context = useMemo(() => {
    return { container };
  }, []);

  const hasThemeExtension = editor.extensionManager.extensions.some(
    (extension) => {
      return extension.name === MAILY_EXTENSION_TYPES.THEME;
    }
  );

  if (!hasThemeExtension) {
    return null;
  }

  return (
    <ThemeSettingsContext value={context}>
      <TooltipProvider>
        <ToolbarPrimitive.Root
          aria-label="Theme settings"
          data-mly-theme-settings=""
          ref={container}
          {...rest}
        >
          {children}
        </ToolbarPrimitive.Root>
      </TooltipProvider>
    </ThemeSettingsContext>
  );
}
