import type { FallbackFont } from '@maily-to/shared';
import {
  allowedFallbackFonts,
  DEFAULT_FONT_FALLBACK,
  DEFAULT_FONT_FAMILY,
  getFontFamilyNames,
  getFontFamilyValue,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { ALargeSmallIcon } from 'lucide-react';
import { useId } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useFontFamilies } from '~/hooks/use-font-families';
import { useLoadFont } from '~/hooks/use-load-font';

import { FieldLabel, FieldRoot } from '../interface/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';
import { useThemeSettingsContext } from './theme-settings-context';
import { getResolvedShellDeclarations } from './theme-settings-field';
import { ThemeSettingsPopover } from './theme-settings-popover';

export type ThemeSettingsFontOptions = {
  fallbackFontFamily: FallbackFont;
  fontFamily: string;
};

export function ThemeSettingsFont() {
  const editor = useEditorInstance();
  const fontFamilies = useFontFamilies(editor);
  const loadFont = useLoadFont();
  const { container } = useThemeSettingsContext();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const body = getResolvedShellDeclarations({
        editor: instance,
        type: 'body',
      });
      const names = body.fontFamily ? getFontFamilyNames(body.fontFamily) : [];

      return {
        fallbackFontFamily: (names.length > 1
          ? names.at(-1)
          : DEFAULT_FONT_FALLBACK) as FallbackFont,
        fontFamily: names[0] ?? DEFAULT_FONT_FAMILY,
      };
    },
  });

  const updateFontFamily = (options: ThemeSettingsFontOptions) => {
    const item = fontFamilies.find((candidate) => {
      return candidate.fontFamily === options.fontFamily;
    });

    if (item) {
      loadFont({ fallbackFontFamily: options.fallbackFontFamily, item });
    }

    return editor
      .chain()
      .updateShellTheme({ body: { fontFamily: getFontFamilyValue(options) } })
      .run();
  };

  const fontFamilyOptions = fontFamilies.some((font) => {
    return font.fontFamily === state.fontFamily;
  })
    ? fontFamilies
    : [{ fontFamily: state.fontFamily }, ...fontFamilies];

  const fontFamilyId = useId();
  const fontFallbackId = useId();

  return (
    <ThemeSettingsPopover icon={ALargeSmallIcon} label="Font">
      <FieldRoot>
        <FieldLabel htmlFor={fontFamilyId}>Font Family</FieldLabel>

        <Select
          items={fontFamilyOptions.map((font) => {
            return {
              label: font.label ?? font.fontFamily,
              value: font.fontFamily,
            };
          })}
          onValueChange={(value) => {
            return updateFontFamily({
              fallbackFontFamily: state.fallbackFontFamily,
              fontFamily: String(value),
            });
          }}
          value={state.fontFamily}
        >
          <SelectTrigger aria-label="Font Family" id={fontFamilyId}>
            <SelectValue />
          </SelectTrigger>

          <SelectPositioner container={container}>
            <SelectContent>
              {fontFamilyOptions.map((font) => (
                <SelectItem key={font.fontFamily} value={font.fontFamily}>
                  {font.label ?? font.fontFamily}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel htmlFor={fontFallbackId}>Fallback</FieldLabel>

        <Select
          onValueChange={(value) => {
            return updateFontFamily({
              fallbackFontFamily: value as FallbackFont,
              fontFamily: state.fontFamily,
            });
          }}
          value={state.fallbackFontFamily}
        >
          <SelectTrigger aria-label="Font Fallback" id={fontFallbackId}>
            <SelectValue />
          </SelectTrigger>

          <SelectPositioner container={container}>
            <SelectContent>
              {allowedFallbackFonts.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </FieldRoot>
    </ThemeSettingsPopover>
  );
}
