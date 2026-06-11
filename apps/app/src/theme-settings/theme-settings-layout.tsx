import { useTheme, useThemeSettingsContext } from '@maily-to/ui';
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  BoxIcon,
  LayoutIcon,
  RulerIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Divider } from './divider';
import { Field } from './settings-field';
import { SettingsPopover } from './settings-popover';

export function ThemeSettingsLayout() {
  const { container } = useThemeSettingsContext();
  const { theme, updateTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const { body, container: cont } = theme;

  return (
    <SettingsPopover
      open={open}
      onOpenChange={setOpen}
      container={container}
      icon={LayoutIcon}
      label="Layout"
      isActive={open}
    >
      <div className="flex flex-col gap-2">
        <Field.Root>
          <Field.Label>Body</Field.Label>
          <Field.ColorField
            color={body.backgroundColor || '#ffffff'}
            onColorChange={(color) => {
              updateTheme({ body: { backgroundColor: color } });
            }}
          />
        </Field.Root>

        <Divider />

        <Field.Root>
          <Field.Label>Padding</Field.Label>
          <Field.FieldGroup>
            <Field.UnitField
              suffix="px"
              min={0}
              max={100}
              value={cont.paddingTop ?? 0}
              onValueChange={(v) => {
                updateTheme({
                  container: { paddingTop: v, paddingBottom: v },
                });
              }}
              dragAreaIcon={
                <AlignVerticalSpaceAroundIcon className="size-3.5" />
              }
            />
            <Field.UnitField
              suffix="px"
              min={0}
              max={100}
              value={cont.paddingRight ?? 0}
              onValueChange={(v) => {
                updateTheme({
                  container: { paddingRight: v, paddingLeft: v },
                });
              }}
              dragAreaIcon={
                <AlignHorizontalSpaceAroundIcon className="size-3.5" />
              }
            />
          </Field.FieldGroup>
        </Field.Root>

        <Field.Root>
          <Field.Label>Gutter</Field.Label>
          <Field.FieldGroup>
            <Field.UnitField
              suffix="px"
              min={0}
              max={100}
              value={body.paddingTop ?? 0}
              onValueChange={(v) => {
                updateTheme({
                  body: { paddingTop: v, paddingBottom: v },
                });
              }}
              dragAreaIcon={
                <AlignVerticalSpaceAroundIcon className="size-3.5" />
              }
            />
            <Field.UnitField
              suffix="px"
              min={0}
              max={100}
              value={body.paddingRight ?? 0}
              onValueChange={(v) => {
                updateTheme({
                  body: { paddingRight: v, paddingLeft: v },
                });
              }}
              dragAreaIcon={
                <AlignHorizontalSpaceAroundIcon className="size-3.5" />
              }
            />
          </Field.FieldGroup>
        </Field.Root>

        <Divider />

        <Field.Root>
          <Field.Label>Container</Field.Label>
          <Field.ColorField
            color={cont.backgroundColor || '#ffffff'}
            onColorChange={(color) => {
              updateTheme({ container: { backgroundColor: color } });
            }}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Radius</Field.Label>
          <Field.UnitField
            suffix="px"
            min={0}
            max={999}
            value={cont.borderRadius ?? 0}
            onValueChange={(v) => {
              updateTheme({ container: { borderRadius: v } });
            }}
            dragAreaIcon={<BoxIcon className="size-3.5" />}
          />
        </Field.Root>

        <Divider />

        <Field.Root>
          <Field.Label>Border</Field.Label>
          <Field.UnitField
            suffix="px"
            min={0}
            max={20}
            value={cont.borderWidth ?? 0}
            onValueChange={(v) => {
              updateTheme({ container: { borderWidth: v } });
            }}
            dragAreaIcon={<RulerIcon className="size-3.5" />}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Border Color</Field.Label>
          <Field.ColorField
            color={cont.borderColor || 'transparent'}
            onColorChange={(color) => {
              updateTheme({ container: { borderColor: color } });
            }}
          />
        </Field.Root>
      </div>
    </SettingsPopover>
  );
}
