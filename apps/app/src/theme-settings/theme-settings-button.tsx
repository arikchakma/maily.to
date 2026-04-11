import { useTheme, useThemeSettingsContext } from '@maily-to/ui';
import { SquareIcon } from 'lucide-react';
import { useState } from 'react';

import { Divider } from './divider';
import { Field } from './settings-field';
import { SettingsPopover } from './settings-popover';
import { SettingsSelect } from './settings-select';

const BUTTON_SIZE_PRESETS = [
  { label: 'Small', paddingX: 24, paddingY: 6 },
  { label: 'Medium', paddingX: 32, paddingY: 10 },
  { label: 'Large', paddingX: 40, paddingY: 14 },
] as const;

function getButtonSize(theme: Record<string, unknown>): string {
  const py = theme.paddingTop ?? 10;
  const px = theme.paddingRight ?? 32;

  const match = BUTTON_SIZE_PRESETS.find(
    (preset) => preset.paddingX === px && preset.paddingY === py
  );

  return match?.label ?? 'Medium';
}

export function ThemeSettingsButton() {
  const { container } = useThemeSettingsContext();
  const { theme, updateTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const { button } = theme;

  return (
    <SettingsPopover
      open={open}
      onOpenChange={setOpen}
      container={container}
      icon={SquareIcon}
      label="Button"
      isActive={open}
    >
      <div className="flex flex-col gap-2">
        <Field.Root>
          <Field.Label>Background</Field.Label>
          <Field.ColorField
            color={button.backgroundColor || '#000000'}
            onColorChange={(color) => {
              updateTheme({ button: { backgroundColor: color } });
            }}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Text</Field.Label>
          <Field.ColorField
            color={button.color || '#ffffff'}
            onColorChange={(color) => {
              updateTheme({ button: { color } });
            }}
          />
        </Field.Root>

        <Divider />

        <Field.Root>
          <Field.Label>Size</Field.Label>
          <SettingsSelect
            container={container}
            value={getButtonSize(button)}
            onValueChange={(value) => {
              const preset = BUTTON_SIZE_PRESETS.find((p) => p.label === value);
              if (!preset) {
                return;
              }

              updateTheme({
                button: {
                  paddingTop: preset.paddingY,
                  paddingBottom: preset.paddingY,
                  paddingRight: preset.paddingX,
                  paddingLeft: preset.paddingX,
                },
              });
            }}
            items={BUTTON_SIZE_PRESETS.map((p) => ({
              value: p.label,
              label: p.label,
            }))}
          />
        </Field.Root>
      </div>
    </SettingsPopover>
  );
}
