import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { useColumnState } from './use-column-state';
import { BubbleMenuButton } from '../bubble-menu-button';
import {
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalDistributeStart,
} from 'lucide-react';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';

export function ColumnBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'column');
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

      return editor.isActive('column');
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
    pluginKey: 'columnBubbleMenu',
  };

  const state = useColumnState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <BubbleMenuButton
        name="Vertical Align Top"
        icon={AlignVerticalDistributeStart}
        command={() => {
          editor.commands.updateColumn('verticalAlign', 'top');
        }}
        isActive={() => state.isVerticalAlignTop}
      />
      <BubbleMenuButton
        name="Vertical Align Middle"
        icon={AlignVerticalDistributeCenter}
        command={() => {
          editor.commands.updateColumn('verticalAlign', 'middle');
        }}
        isActive={() => state.isVerticalAlignMiddle}
      />
      <BubbleMenuButton
        name="Vertical Align Bottom"
        icon={AlignVerticalDistributeEnd}
        command={() => {
          editor.commands.updateColumn('verticalAlign', 'bottom');
        }}
        isActive={() => state.isVerticalAlignBottom}
      />
    </BubbleMenu>
  );
}
