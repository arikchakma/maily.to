import type { AllowedBorderStyle, AllowedFieldMode } from '@maily-to/shared';
import { DEFAULT_BORDER_COLOR, FIELD_MODE } from '@maily-to/shared';
import { useMailyId } from '@maily-to/ui';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { ScanIcon } from 'lucide-react';
import { useState } from 'react';

import type { ButtonAttributes } from '~/extensions/button/button';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { DEFAULT_COLOR_SWATCHES } from '~/utils/color-swatch';

import { ColorPicker } from '../color-picker/color-picker';
import { ColorSwatch } from '../color-picker/color-swatch';
import { CornerIcon } from '../icons/corner-icon';
import { SideIcon } from '../icons/side-icon';
import {
  RADIUS_PRESETS,
  STYLE_PRESETS,
  THICKNESS_PRESETS,
} from '../image-bubble-menu/border-style-config';
import { Divider } from '../interface/divider';
import type { Corner, MultiValue, Side } from '../interface/multi-unit-field';
import {
  CORNER_AXES,
  MultiUnitField,
  SIDE_AXES,
} from '../interface/multi-unit-field';
import { PopoverBack } from '../interface/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';

const COLOR_PRESETS = DEFAULT_COLOR_SWATCHES.map((color) => {
  return {
    id: color.id,
    color: color.text,
    label: color.label,
  };
});

type ButtonBorderStyleConfigProps = {
  container: FloatingUIContainer;
  editor: Editor;
  onBack: () => void;
};

export function ButtonBorderStyleConfig(props: ButtonBorderStyleConfigProps) {
  const { container, editor, onBack } = props;

  const editorInstance = useEditorInstance(editor);
  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const button = ctx.editor.getAttributes('button') as ButtonAttributes;

      return {
        widthMode: button.borderWidthMode,
        widthValues: {
          top: button.borderTopWidth,
          right: button.borderRightWidth,
          bottom: button.borderBottomWidth,
          left: button.borderLeftWidth,
        },
        radiusMode: button.borderRadiusMode,
        radiusValues: {
          topLeft: button.borderTopLeftRadius,
          topRight: button.borderTopRightRadius,
          bottomRight: button.borderBottomRightRadius,
          bottomLeft: button.borderBottomLeftRadius,
        },
        borderStyle: button.borderStyle,
        borderColor: button.borderColor,
      };
    },
  });

  const handleWidthModeChange = (nextWidthMode: AllowedFieldMode) => {
    editorInstance
      .chain()
      .updateButtonAttributes({ borderWidthMode: nextWidthMode })
      .run();
  };

  const handleWidthValuesChange = (nextWidthValues: MultiValue<Side>) => {
    editorInstance
      .chain()
      .updateButtonAttributes({
        borderTopWidth: nextWidthValues.top,
        borderRightWidth: nextWidthValues.right,
        borderBottomWidth: nextWidthValues.bottom,
        borderLeftWidth: nextWidthValues.left,
      })
      .run();
  };

  const handleRadiusModeChange = (nextRadiusMode: AllowedFieldMode) => {
    editorInstance
      .chain()
      .updateButtonAttributes({ borderRadiusMode: nextRadiusMode })
      .run();
  };

  const handleRadiusValuesChange = (nextRadiusValues: MultiValue<Corner>) => {
    editorInstance
      .chain()
      .updateButtonAttributes({
        borderTopLeftRadius: nextRadiusValues.topLeft,
        borderTopRightRadius: nextRadiusValues.topRight,
        borderBottomRightRadius: nextRadiusValues.bottomRight,
        borderBottomLeftRadius: nextRadiusValues.bottomLeft,
      })
      .run();
  };

  const handleBorderStyleChange = (nextBorderStyle: AllowedBorderStyle) => {
    editorInstance
      .chain()
      .updateButtonAttributes({ borderStyle: nextBorderStyle })
      .run();
  };

  const styleFieldId = useMailyId();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleBorderColorChange = (nextBorderColor: string | null) => {
    editorInstance
      .chain()
      .updateButtonAttributes({
        borderColor: nextBorderColor ?? DEFAULT_BORDER_COLOR,
      })
      .run();
  };

  if (isColorPickerOpen) {
    return (
      <>
        <PopoverBack
          onClick={() => setIsColorPickerOpen(false)}
          className="mly:mb-1"
        >
          Back to Border Style
        </PopoverBack>
        <ColorPicker
          color={state.borderColor}
          onColorChange={handleBorderColorChange}
        />
      </>
    );
  }

  return (
    <div className="mly:flex mly:flex-col mly:gap-1">
      <PopoverBack onClick={onBack}>Border</PopoverBack>

      <Divider type="horizontal" className="mly:-mx-1" />

      <MultiUnitField
        container={container}
        label="Radius"
        dragAreaIcon={
          <ScanIcon className="mly:size-3.5 mly:text-midnight-gray" />
        }
        mode={state.radiusMode}
        onModeChange={handleRadiusModeChange}
        values={state.radiusValues}
        onValuesChange={handleRadiusValuesChange}
        presets={RADIUS_PRESETS}
        min={0}
        max={9999}
        suffix="px"
        axes={CORNER_AXES}
        axisIcons={{
          topLeft: (
            <CornerIcon
              corner="topLeft"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          topRight: (
            <CornerIcon
              corner="topRight"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          bottomRight: (
            <CornerIcon
              corner="bottomRight"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          bottomLeft: (
            <CornerIcon
              corner="bottomLeft"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
        }}
      />

      {state.radiusMode === FIELD_MODE.MIXED && (
        <Divider type="horizontal" className="mly:-mx-1" />
      )}

      <MultiUnitField
        label="Width"
        dragAreaIcon={
          <SideIcon
            side="mixed"
            className="mly:size-3.5 mly:text-midnight-gray"
          />
        }
        container={container}
        mode={state.widthMode}
        onModeChange={handleWidthModeChange}
        values={state.widthValues}
        onValuesChange={handleWidthValuesChange}
        presets={THICKNESS_PRESETS}
        min={0}
        max={8}
        suffix="px"
        axes={SIDE_AXES}
        axisIcons={{
          top: (
            <SideIcon
              side="top"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          right: (
            <SideIcon
              side="right"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          bottom: (
            <SideIcon
              side="bottom"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          left: (
            <SideIcon
              side="left"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
        }}
      />

      {state.widthMode === FIELD_MODE.MIXED && (
        <Divider type="horizontal" className="mly:-mx-1" />
      )}

      <div className="mly:flex mly:w-full mly:items-center mly:justify-between mly:gap-2 mly:pr-8">
        <label
          htmlFor={styleFieldId}
          className="mly:min-w-16 mly:pl-2 mly:text-sm mly:text-gray-500"
        >
          Style
        </label>
        <Select
          id={styleFieldId}
          items={STYLE_PRESETS}
          value={state.borderStyle}
          onValueChange={(value) => {
            handleBorderStyleChange(value as AllowedBorderStyle);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectPositioner align="end">
            <SelectContent className="mly:w-30.5 mly:p-0.5">
              {STYLE_PRESETS?.map((preset) => {
                const { value, label } = preset;

                return (
                  <SelectItem key={label} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </div>
      <div className="mly:flex mly:w-full mly:items-start mly:justify-between mly:gap-2 mly:pr-8">
        <label
          htmlFor={styleFieldId}
          className="mly:flex mly:h-7 mly:min-w-16 mly:items-center mly:pl-2 mly:text-sm mly:text-gray-500"
        >
          Color
        </label>
        <ColorSwatch
          color={state.borderColor}
          container={container}
          items={COLOR_PRESETS}
          onColorClick={handleBorderColorChange}
          onCustomColorClick={() => setIsColorPickerOpen(true)}
          onResetColorClick={() => handleBorderColorChange(null)}
        />
      </div>
    </div>
  );
}
