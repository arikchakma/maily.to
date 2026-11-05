import { useEditorState } from '@tiptap/react';
import { SquareIcon, SquareRoundCornerIcon } from 'lucide-react';
import { useId } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import {
  getBackgroundColorSwatches,
  getTextColorSwatches,
} from '~/utils/color-swatch';

import { Divider } from '../interface/divider';
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
import {
  getResolvedThemeDeclarations,
  ThemeSettingsColorField,
  ThemeSettingsUnitField,
} from './theme-settings-field';
import { ThemeSettingsPopover } from './theme-settings-popover';

const CUSTOM_SIZE = 'Custom';

const MAX_RADIUS = 999;

const BUTTON_SIZE_PRESETS = [
  { label: 'Small', value: '6px 24px' },
  { label: 'Medium', value: '10px 32px' },
  { label: 'Large', value: '14px 40px' },
];

function getButtonSize(padding: string) {
  const preset = BUTTON_SIZE_PRESETS.find((candidate) => {
    return candidate.value === padding;
  });

  return preset?.label ?? CUSTOM_SIZE;
}

export function ThemeSettingsButton() {
  const editor = useEditorInstance();
  const { container } = useThemeSettingsContext();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const button = getResolvedThemeDeclarations({
        editor: instance,
        type: 'button',
      });

      return {
        backgroundColor: button.backgroundColor ?? '',
        borderRadius: Number.parseFloat(button.borderRadius ?? '') || 0,
        color: button.color ?? '',
        size: getButtonSize(button.padding ?? ''),
      };
    },
  });

  const sizeOptions =
    state.size === CUSTOM_SIZE
      ? [{ label: CUSTOM_SIZE, value: CUSTOM_SIZE }, ...BUTTON_SIZE_PRESETS]
      : BUTTON_SIZE_PRESETS;

  const updateSize = (label: string) => {
    const preset = BUTTON_SIZE_PRESETS.find((candidate) => {
      return candidate.label === label;
    });

    if (!preset) {
      return false;
    }

    return editor
      .chain()
      .updateNodeTheme({ button: { padding: preset.value } })
      .run();
  };

  const sizeId = useId();

  return (
    <ThemeSettingsPopover icon={SquareIcon} label="Button">
      <ThemeSettingsColorField
        color={state.backgroundColor}
        items={getBackgroundColorSwatches()}
        label="Background"
        onColorChange={(color) => {
          return editor
            .chain()
            .updateNodeTheme({ button: { backgroundColor: color } })
            .run();
        }}
      />

      <ThemeSettingsColorField
        color={state.color}
        items={getTextColorSwatches()}
        label="Text"
        onColorChange={(color) => {
          return editor.chain().updateNodeTheme({ button: { color } }).run();
        }}
      />

      <Divider type="horizontal" />

      <FieldRoot>
        <FieldLabel htmlFor={sizeId}>Size</FieldLabel>

        <Select
          items={sizeOptions}
          onValueChange={(value) => {
            return updateSize(String(value));
          }}
          value={state.size}
        >
          <SelectTrigger aria-label="Button Size" id={sizeId}>
            <SelectValue />
          </SelectTrigger>

          <SelectPositioner container={container}>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.label} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel>Radius</FieldLabel>

        <ThemeSettingsUnitField
          dragAreaIcon={<SquareRoundCornerIcon size={14} />}
          label="Button Radius"
          max={MAX_RADIUS}
          onValueCommitted={(value) => {
            return editor
              .chain()
              .updateNodeTheme({ button: { borderRadius: `${value}px` } })
              .run();
          }}
          value={state.borderRadius}
        />
      </FieldRoot>
    </ThemeSettingsPopover>
  );
}
