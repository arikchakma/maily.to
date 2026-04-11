import { useTheme, useThemeSettingsContext } from '@maily-to/ui';
import { LinkIcon } from 'lucide-react';
import { useState } from 'react';

import { Field } from './settings-field';
import { SettingsPopover } from './settings-popover';

export function ThemeSettingsLink() {
  const { container } = useThemeSettingsContext();
  const { theme, updateTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const { link } = theme;

  return (
    <SettingsPopover
      open={open}
      onOpenChange={setOpen}
      container={container}
      icon={LinkIcon}
      label="Link"
      isActive={open}
    >
      <div className="flex flex-col gap-2">
        <Field.Root>
          <Field.Label>Color</Field.Label>
          <Field.ColorField
            color={link.color || '#111827'}
            onColorChange={(color) => {
              updateTheme({ link: { color } });
            }}
          />
        </Field.Root>
      </div>
    </SettingsPopover>
  );
}
