import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { useColumnsState } from './use-columns-state';
import { ColumnsWidth } from './columns-width';
import { BubbleMenuButton } from '../bubble-menu-button';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalDistributeStart,
  Box,
  BoxSelect,
  Minus,
  Plus,
  Scan,
} from 'lucide-react';
import { Divider } from '../ui/divider';
import { addColumn, removeColumn } from '@/editor/utils/columns';
import { NumberInput } from '../ui/number-input';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { EdgeSpacingControl } from '../ui/edge-spacing-controls';
import { TooltipProvider } from '../ui/tooltip';

export function ColumnsBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'columns');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (isTextSelected(editor)) {
        return false;
      }

      return editor.isActive('columns');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: 'auto',
    },
    pluginKey: 'columnsBubbleMenu',
  };

  const state = useColumnsState(editor);

  const isColumnAllPaddingEqual =
    state.columnPaddingTop === state.columnPaddingRight &&
    state.columnPaddingRight === state.columnPaddingBottom &&
    state.columnPaddingBottom === state.columnPaddingLeft;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-shadow-md"
    >
      <div className="mly-border-b mly-p-1 mly-pt-2">
        <span className="mly-ml-1 mly-block mly-text-[10px] mly-uppercase mly-leading-none mly-text-gray-500">
          Row
        </span>
        <TooltipProvider>
          <div className="mly-mt-2 mly-flex mly-items-stretch">
            <ColumnsWidth
              selectedValue={state.width}
              onValueChange={(value) => {
                editor.commands.updateColumns({
                  width: value,
                });
              }}
              tooltip="Row width"
            />
            <Divider />
            <BubbleMenuButton
              icon={Plus}
              command={() => {
                addColumn(editor);
              }}
              isActive={() => false}
              disbabled={state.columnsCount >= 10}
              className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
              iconClassName="mly-w-3 mly-h-3"
              tooltip="Add Column"
            />
            <BubbleMenuButton
              icon={Minus}
              command={() => {
                removeColumn(editor);
              }}
              isActive={() => false}
              disbabled={state.columnsCount <= 2}
              className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
              iconClassName="mly-w-3 mly-h-3"
              tooltip="Remove Column"
            />
          </div>
        </TooltipProvider>
      </div>

      {state.isColumnActive && (
        <div className="mly-p-1 mly-pt-2">
          <span className="mly-ml-1 mly-block mly-text-[10px] mly-uppercase mly-leading-none mly-text-gray-500">
            Column
          </span>
          <TooltipProvider>
            <div className="mly-mt-2 mly-flex mly-items-stretch">
              <BubbleMenuButton
                name="Vertical Align Top"
                icon={AlignVerticalDistributeStart}
                command={() => {
                  editor.commands.updateColumn({ verticalAlign: 'top' });
                }}
                isActive={() => state.isVerticalAlignTop}
                className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
                iconClassName="mly-w-3 mly-h-3"
                tooltip="Vertical Align Top"
              />
              <BubbleMenuButton
                name="Vertical Align Middle"
                icon={AlignVerticalDistributeCenter}
                command={() => {
                  editor.commands.updateColumn({ verticalAlign: 'middle' });
                }}
                isActive={() => state.isVerticalAlignMiddle}
                className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
                iconClassName="mly-w-3 mly-h-3"
                tooltip="Vertical Align Middle"
              />
              <BubbleMenuButton
                name="Vertical Align Bottom"
                icon={AlignVerticalDistributeEnd}
                command={() => {
                  editor.commands.updateColumn({ verticalAlign: 'bottom' });
                }}
                isActive={() => state.isVerticalAlignBottom}
                className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
                iconClassName="mly-w-3 mly-h-3"
                tooltip="Vertical Align Bottom"
              />
              <Divider />
              <ColorPicker
                color={state.columnBackgroundColor}
                onColorChange={(color) => {
                  editor?.commands?.updateColumn({
                    backgroundColor: color,
                  });
                }}
                backgroundColor={state.columnBackgroundColor}
                className="mly-border-[1px]"
                tooltip="Background Color"
              />
              <Divider />
              <NumberInput
                icon={Box}
                value={isColumnAllPaddingEqual ? state.columnPaddingTop : 0}
                onValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    paddingTop: value,
                    paddingRight: value,
                    paddingBottom: value,
                    paddingLeft: value,
                  });
                }}
                tooltip="Padding"
              />
              <EdgeSpacingControl
                top={state.columnPaddingTop}
                right={state.columnPaddingRight}
                bottom={state.columnPaddingBottom}
                left={state.columnPaddingLeft}
                onTopValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    paddingTop: value,
                  });
                }}
                onRightValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    paddingRight: value,
                  });
                }}
                onBottomValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    paddingBottom: value,
                  });
                }}
                onLeftValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    paddingLeft: value,
                  });
                }}
              />
              <Divider />
              <NumberInput
                icon={Scan}
                value={state.columnBorderRadius}
                onValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    borderRadius: value,
                  });
                }}
                tooltip="Border Radius"
              />
              <NumberInput
                max={8}
                icon={BoxSelect}
                value={state.columnBorderWidth}
                onValueChange={(value) => {
                  editor?.commands?.updateColumn({
                    borderWidth: value,
                  });
                }}
                tooltip="Border Width"
              />
              <ColorPicker
                color={state.columnBorderColor}
                onColorChange={(color) => {
                  editor?.commands?.updateColumn({
                    borderColor: color,
                  });
                }}
                borderColor={state.columnBorderColor}
                backgroundColor="transparent"
                tooltip="Border Color"
                className="mly-shadow"
              />
            </div>
          </TooltipProvider>
        </div>
      )}
    </BubbleMenu>
  );
}
