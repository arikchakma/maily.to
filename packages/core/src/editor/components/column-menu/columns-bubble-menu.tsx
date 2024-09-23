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
} from 'lucide-react';
import { Divider } from '../ui/divider';

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
    },
    pluginKey: 'columnsBubbleMenu',
  };

  const state = useColumnsState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-shadow-md"
    >
      {state.isColumnActive && (
        <div className="mly-border-b mly-p-1 mly-pt-2">
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
          </div>
        </div>
      )}

      <div className="mly-p-1 mly-pt-2">
        <span className="mly-ml-1 mly-block mly-text-[10px] mly-uppercase mly-leading-none mly-text-gray-500">
          Table
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
            name="Align Left"
            isActive={() => state.isAlignLeft}
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
            iconClassName="mly-w-3 mly-h-3"
            icon={AlignLeft}
            command={() => editor.commands.updateColumns({ align: 'left' })}
          />
          {state.isSectionActive && (
            <BubbleMenuButton
              // Align Center is only available when it's in a section
              name="Align Center"
              isActive={() => state.isAlignCenter}
              className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
              iconClassName="mly-w-3 mly-h-3"
              icon={AlignCenter}
              command={() => editor.commands.updateColumns({ align: 'center' })}
            />
          )}
          <BubbleMenuButton
            name="Align Right"
            isActive={() => state.isAlignRight}
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
            iconClassName="mly-w-3 mly-h-3"
            icon={AlignRight}
            command={() => editor.commands.updateColumns({ align: 'right' })}
          />
        </div>
      </div>
    </BubbleMenu>
  );
}
