import type { FallbackFont, FontFamilyItem } from '@maily-to/shared';
import {
  allowedFallbackFonts,
  DEFAULT_FONT,
  DEFAULT_FONT_FAMILIES,
  loadFont,
} from '@maily-to/shared';
import { useTheme, useThemeSettingsContext } from '@maily-to/ui';
import { ALargeSmallIcon } from 'lucide-react';
import { useState } from 'react';

import { Field } from './settings-field';
import { SettingsPopover } from './settings-popover';
import { SettingsSelect } from './settings-select';

const DEFAULT_OPTION_ID = '__default__';
const loadedFonts = new Set<string>();

function injectFont(item: FontFamilyItem, fallbackFontFamily: FallbackFont) {
  if (!item.webFont || loadedFonts.has(item.fontFamily)) {
    return;
  }

  loadFont({
    fontFamily: item.fontFamily,
    fallbackFontFamily,
    webFont: item.webFont,
  });
  loadedFonts.add(item.fontFamily);
}

export function ThemeSettingsFont() {
  const { container } = useThemeSettingsContext();
  const { theme, updateTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeFont = theme.font ?? null;

  const selectedFontFamily =
    DEFAULT_FONT_FAMILIES.find((f) => f.fontFamily === themeFont?.fontFamily)
      ?.fontFamily ?? DEFAULT_OPTION_ID;

  return (
    <SettingsPopover
      open={open}
      onOpenChange={setOpen}
      container={container}
      icon={ALargeSmallIcon}
      label="Font"
      isActive={open}
    >
      <div className="flex flex-col gap-2">
        <Field.Root>
          <Field.Label>Font Family</Field.Label>
          <SettingsSelect
            container={container}
            value={selectedFontFamily}
            onValueChange={(value) => {
              if (value === DEFAULT_OPTION_ID) {
                updateTheme({ font: null });
                return;
              }

              const item = DEFAULT_FONT_FAMILIES.find(
                (f) => f.fontFamily === value
              );
              if (!item) {
                return;
              }

              const fallbackFontFamily =
                themeFont?.fallbackFontFamily ??
                DEFAULT_FONT.fallbackFontFamily;

              injectFont(item, fallbackFontFamily);

              updateTheme({
                font: {
                  fontFamily: item.fontFamily,
                  fallbackFontFamily,
                  webFont: item.webFont,
                },
              });
            }}
            items={[
              { value: DEFAULT_OPTION_ID, label: 'Default' },
              ...DEFAULT_FONT_FAMILIES.map((f) => ({
                value: f.fontFamily,
                label: f.label ?? f.fontFamily,
              })),
            ]}
          />
        </Field.Root>

        {themeFont ? (
          <Field.Root>
            <Field.Label>Fallback Font</Field.Label>
            <SettingsSelect
              container={container}
              value={
                themeFont.fallbackFontFamily ?? DEFAULT_FONT.fallbackFontFamily
              }
              onValueChange={(value) => {
                updateTheme({
                  font: {
                    ...themeFont,
                    fallbackFontFamily: value as FallbackFont,
                  },
                });
              }}
              items={allowedFallbackFonts.map((f) => ({
                value: f,
                label: f,
              }))}
            />
          </Field.Root>
        ) : null}
      </div>
    </SettingsPopover>
  );
}
