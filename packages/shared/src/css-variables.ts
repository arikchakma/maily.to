import type * as CSS from 'csstype';
import { DEFAULT_FONT, type EditorThemeOptions } from './theme';

declare module 'csstype' {
  interface Properties {
    [index: `--mly-${string}`]: any;
  }
}

/**
 * if the value is undefined, it will return an empty object
 * so that we don't override the default value
 * @param name - The name of the CSS variable
 * @param value - The value of the CSS variable
 * @returns The CSS variable value
 */
export function getVariableValue(
  name: `--mly-${string}`,
  value: any
): CSS.Properties {
  if (value === undefined || value === null || value === '') {
    return {};
  }

  return {
    [name]: value,
  };
}

/**
 * Get the CSS variables for the theme
 * @param theme - The theme
 * @returns The CSS variables
 * @example
 * ```ts
 * const theme = {
 *   body: {
 *     backgroundColor: 'red',
 *   },
 * };
 *
 * const cssVariables = getCssVariables(theme);
 *
 * console.log(cssVariables);
 * // { '--mly-body-background-color': 'red' }
 */
export function getMailyCssVariables(
  theme: EditorThemeOptions
): CSS.Properties {
  const font = theme.font || DEFAULT_FONT;

  return {
    ...getVariableValue(
      '--mly-body-background-color',
      theme.body?.backgroundColor
    ),
    ...getVariableValue('--mly-body-padding-top', theme.body?.paddingTop),
    ...getVariableValue('--mly-body-padding-right', theme.body?.paddingRight),
    ...getVariableValue('--mly-body-padding-bottom', theme.body?.paddingBottom),
    ...getVariableValue('--mly-body-padding-left', theme.body?.paddingLeft),

    ...getVariableValue(
      '--mly-container-background-color',
      theme.container?.backgroundColor
    ),
    ...getVariableValue('--mly-container-max-width', theme.container?.maxWidth),
    ...getVariableValue('--mly-container-min-width', theme.container?.minWidth),

    ...getVariableValue(
      '--mly-container-padding-top',
      theme.container?.paddingTop
    ),
    ...getVariableValue(
      '--mly-container-padding-right',
      theme.container?.paddingRight
    ),
    ...getVariableValue(
      '--mly-container-padding-bottom',
      theme.container?.paddingBottom
    ),
    ...getVariableValue(
      '--mly-container-padding-left',
      theme.container?.paddingLeft
    ),

    ...getVariableValue(
      '--mly-container-border-radius',
      theme.container?.borderRadius
    ),
    ...getVariableValue(
      '--mly-container-border-width',
      theme.container?.borderWidth
    ),
    ...getVariableValue(
      '--mly-container-border-color',
      theme.container?.borderColor
    ),

    ...getVariableValue(
      '--mly-button-background-color',
      theme.button?.backgroundColor
    ),
    ...getVariableValue('--mly-button-text-color', theme.button?.color),
    ...getVariableValue('--mly-button-padding-top', theme.button?.paddingTop),
    ...getVariableValue(
      '--mly-button-padding-right',
      theme.button?.paddingRight
    ),
    ...getVariableValue(
      '--mly-button-padding-bottom',
      theme.button?.paddingBottom
    ),
    ...getVariableValue('--mly-button-padding-left', theme.button?.paddingLeft),

    ...getVariableValue('--mly-link-color', theme.link?.color),

    ...getVariableValue('--mly-font-family', font.fontFamily),
    ...getVariableValue('--mly-font-fallback-family', font.fallbackFontFamily),
    '--mly-font': `var(--mly-font-family), var(--mly-font-fallback-family)`,
  };
}
