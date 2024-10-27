import { BubbleMenu } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { useColumnsState } from './use-columns-state';
import { Divider } from '../ui/divider';
import { ColorPicker } from '../ui/color-picker';
import { TooltipProvider } from '../ui/tooltip';
import { Select } from '../ui/select';
import { BaseButton } from '../base-button';
import { BorderColor } from '../icons/border-color';
import { VerticalAlignmentSwitch } from '../vertical-alignment-switch';

type ColumnsBubbleMenuProps = {
  editor: EditorBubbleMenuProps['editor'];
};

export function ColumnsBubbleMenuContent(props: ColumnsBubbleMenuProps) {
  const { editor } = props;
  if (!editor) {
    return null;
  }

  const state = useColumnsState(editor);

  const borderRadiusOptions = [
    { value: '0', label: 'Sharp' },
    { value: '6', label: 'Smooth' },
    { value: '9999', label: 'Round' },
  ];

  return (
    <TooltipProvider>
      <div className="mly-flex mly-items-stretch">
        <Select
          label="Row Width"
          value={state.width}
          onValueChange={(value) => {
            editor.commands.updateColumns({
              width: value,
            });
          }}
          options={[
            {
              label: 'Fit content',
              value: 'auto',
            },
            {
              label: 'Stretch',
              value: '100%',
            },
          ]}
          tooltip="Row width"
        />

        {state.isColumnActive && (
          <>
            <Divider />

            <VerticalAlignmentSwitch
              alignment={state.currentVerticalAlignment}
              onAlignmentChange={(value) => {
                editor.commands.updateColumn({
                  verticalAlign: value,
                });
              }}
            />

            <Divider />

            <div className="mly-flex mly-space-x-0.5">
              <Select
                label="Border Radius"
                value={String(state.columnBorderRadius)}
                options={borderRadiusOptions}
                onValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    borderRadius: Number(value),
                  });
                }}
                tooltip="Border Radius"
                className="mly-capitalize"
              />

              <Select
                label="Border Width"
                value={String(state.columnBorderWidth)}
                options={[
                  { value: '0', label: 'None' },
                  { value: '1', label: 'Thin' },
                  { value: '2', label: 'Medium' },
                  { value: '3', label: 'Thick' },
                ]}
                onValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    borderWidth: Number(value),
                  });
                }}
                tooltip="Border Width"
                className="mly-capitalize"
              />
            </div>

            <Divider />

            <div className="mly-flex mly-space-x-0.5">
              <ColorPicker
                color={state.columnBorderColor}
                onColorChange={(color) => {
                  editor?.commands?.updateColumn({
                    borderColor: color,
                  });
                }}
                tooltip="Border Color"
              >
                <BaseButton
                  variant="ghost"
                  className="!mly-size-7 mly-shrink-0"
                  size="sm"
                  type="button"
                >
                  <BorderColor
                    className="mly-size-3 mly-shrink-0"
                    topBarClassName="mly-stroke-midnight-gray"
                    style={{
                      color: state.columnBorderColor,
                    }}
                  />
                </BaseButton>
              </ColorPicker>
              <ColorPicker
                color={state.columnBackgroundColor}
                onColorChange={(color) => {
                  editor?.commands?.updateColumn({
                    backgroundColor: color,
                  });
                }}
                backgroundColor={state.columnBackgroundColor}
                tooltip="Background Color"
                className="mly-rounded-full mly-border-[1.5px] mly-border-white mly-shadow"
              />
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
