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
        <div className="mly-mt-2 mly-flex mly-items-stretch">
          <ColumnsWidth
            selectedValue={state.width}
            onValueChange={(value) => {
              editor.commands.updateColumns({
                width: value,
              });
            }}
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
          />
        </div>
      </div>

      {state.isColumnActive && (
        <div className="mly-p-1 mly-pt-2">
          <span className="mly-ml-1 mly-block mly-text-[10px] mly-uppercase mly-leading-none mly-text-gray-500">
            Column
          </span>
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
            />
            <Divider />
            <ColorPicker
              color={state.columnBackgroundColor}
              onColorChange={(color) => {
                editor?.commands?.updateColumn({
                  backgroundColor: color,
                });
              }}
            >
              <BaseButton
                variant="ghost"
                className="!mly-size-7 mly-shrink-0"
                size="sm"
                type="button"
              >
                <div
                  className="mly-h-3.5 mly-w-3.5 mly-shrink-0 mly-rounded mly-border mly-border-gray-700"
                  style={{
                    backgroundColor: state.columnBackgroundColor,
                  }}
                />
              </BaseButton>
            </ColorPicker>
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
            />
            <Divider />
            <NumberInput
              max={8}
              icon={BoxSelect}
              value={state.columnBorderWidth}
              onValueChange={(value) => {
                editor?.commands?.updateColumn({
                  borderWidth: value,
                });
              }}
            />
            <Divider />
            <ColorPicker
              color={state.columnBorderColor}
              onColorChange={(color) => {
                editor?.commands?.updateColumn({
                  borderColor: color,
                });
              }}
            >
              <BaseButton
                variant="ghost"
                className="!mly-size-7 mly-shrink-0"
                size="sm"
                type="button"
              >
                <div
                  className="mly-h-3.5 mly-w-3.5 mly-shrink-0 mly-rounded mly-border-2 mly-border-gray-700 mly-shadow"
                  style={{
                    borderColor: state.columnBorderColor,
                    backgroundColor: 'transparent',
                  }}
                />
              </BaseButton>
            </ColorPicker>
          </div>
        </div>
      )}
    </BubbleMenu>
  );
}
