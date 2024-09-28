import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { useSectionState } from './use-section-state';
import { NumberInput } from '../ui/number-input';
import { AlignCenter, AlignLeft, AlignRight, Box, Scan } from 'lucide-react';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { Divider } from '../ui/divider';
import { BubbleMenuButton } from '../bubble-menu-button';

export function SectionBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'section');
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

      return (
        editor.isActive('section') &&
        !editor.isActive('columns') &&
        !editor.isActive('column')
      );
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
    pluginKey: 'sectionBubbleMenu',
  };

  const state = useSectionState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <NumberInput
        icon={Scan}
        value={state.currentBorderRadius}
        onValueChange={(value) => {
          editor?.commands?.updateSection({
            borderRadius: value,
          });
        }}
      />
      <Divider />
      <NumberInput
        icon={Box}
        value={state.currentPadding}
        onValueChange={(value) => {
          editor?.commands?.updateSection({
            padding: value,
          });
        }}
      />
      <Divider />
      <ColorPicker
        color={state.currentBackgroundColor}
        onColorChange={(color) => {
          editor?.commands?.updateSection({
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
            className="mly-h-4 mly-w-4 mly-shrink-0 mly-rounded mly-border mly-border-gray-700"
            style={{
              backgroundColor: state.currentBackgroundColor,
            }}
          />
        </BaseButton>
      </ColorPicker>
      <Divider />
      <BubbleMenuButton
        name="Align Left"
        isActive={() => state.isAlignLeft}
        className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
        iconClassName="mly-w-3 mly-h-3"
        icon={AlignLeft}
        command={() => editor.commands.updateSection({ align: 'left' })}
      />
      <BubbleMenuButton
        name="Align Center"
        isActive={() => state.isAlignCenter}
        className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
        iconClassName="mly-w-3 mly-h-3"
        icon={AlignCenter}
        command={() => editor.commands.updateSection({ align: 'center' })}
      />
      <BubbleMenuButton
        name="Align Right"
        isActive={() => state.isAlignRight}
        className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
        iconClassName="mly-w-3 mly-h-3"
        icon={AlignRight}
        command={() => editor.commands.updateSection({ align: 'right' })}
      />
    </BubbleMenu>
  );
}
