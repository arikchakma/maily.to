import type { InlineStyle, NodeThemeOptions } from '@maily-to/shared';
import {
  DEFAULT_NODE_THEME,
  expandInlineStyles,
  parseInlineStyles,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { ShellType } from '~/utils/theme';
import { getNodeTheme, getShellNodes } from '~/utils/theme';

import type { ColorSwatchItem } from '../color-picker/color-swatch';
import { ColorSwatchPopover } from '../color-picker/color-swatch-popover';
import { BubbleButton } from '../interface/bubble-button';
import { FieldLabel, FieldRoot } from '../interface/field';
import type { UnitFieldPreset } from '../interface/unit-field';
import { UnitField } from '../interface/unit-field';
import { useThemeSettingsContext } from './theme-settings-context';

export type ResolvedThemeDeclarationsOptions = {
  editor: Editor;
  type: keyof NodeThemeOptions;
};

export function getResolvedThemeDeclarations(
  options: ResolvedThemeDeclarationsOptions
): InlineStyle {
  const { editor, type } = options;

  return { ...DEFAULT_NODE_THEME[type], ...getNodeTheme(editor)[type] };
}

export type ResolvedShellDeclarationsOptions = {
  editor: Editor;
  type: ShellType;
};

export function getResolvedShellDeclarations(
  options: ResolvedShellDeclarationsOptions
): InlineStyle {
  const { editor, type } = options;
  const [shell] = getShellNodes({ doc: editor.state.doc, type });
  const authored = (shell?.node.attrs.style as string | null) ?? null;

  return {
    ...expandInlineStyles(getResolvedThemeDeclarations({ editor, type })),
    ...expandInlineStyles(parseInlineStyles(authored ?? '')),
  };
}

export type ThemeSettingsColorFieldProps = {
  color: string;
  items: ColorSwatchItem[];
  label: string;
  onColorChange: (color: string) => void;
};

export function ThemeSettingsColorField(props: ThemeSettingsColorFieldProps) {
  const { color, items, label, onColorChange } = props;

  const { container } = useThemeSettingsContext();

  return (
    <FieldRoot>
      <FieldLabel>{label}</FieldLabel>

      <ColorSwatchPopover
        color={color}
        container={container}
        items={items}
        onColorChange={onColorChange}
        renderTrigger={(state) => (
          <BubbleButton
            container={container}
            data-mly-theme-settings-color=""
            isActive={state.isActive}
            label={label}
            render={state.render}
          >
            <span
              data-mly-theme-settings-swatch=""
              style={{ backgroundColor: color || 'transparent' }}
            />
            <span data-mly-theme-settings-color-value="">
              {color || 'None'}
            </span>
          </BubbleButton>
        )}
      />
    </FieldRoot>
  );
}

export type ThemeSettingsUnitFieldProps = {
  dragAreaIcon?: ReactNode;
  label: string;
  max?: number;
  min?: number;
  onValueCommitted: (value: number) => void;
  presets?: UnitFieldPreset[];
  value: number;
};

export function ThemeSettingsUnitField(props: ThemeSettingsUnitFieldProps) {
  const {
    dragAreaIcon,
    label,
    max = 100,
    min = 0,
    onValueCommitted,
    presets,
    value,
  } = props;

  const { container } = useThemeSettingsContext();

  const [localValue, setLocalValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);

  if (previousValue !== value) {
    setPreviousValue(value);
    setLocalValue(value);
  }

  return (
    <UnitField
      container={container}
      dragAreaIcon={dragAreaIcon}
      displayValue={`${localValue}px`}
      label={label}
      max={max}
      min={min}
      onSelectPreset={onValueCommitted}
      onValueChange={setLocalValue}
      onValueCommitted={onValueCommitted}
      presets={presets}
      suffix="px"
      value={localValue}
    />
  );
}
