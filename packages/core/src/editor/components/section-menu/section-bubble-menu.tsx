import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { useSectionState } from './use-section-state';
import { NumberInput } from '../ui/number-input';
import { Box, Scan } from 'lucide-react';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';

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

      return editor.isActive('section');
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
      <div className="mly-mx-0.5 mly-w-px mly-bg-gray-200" />
      <NumberInput
        icon={Box}
        value={state.currentPadding}
        onValueChange={(value) => {
          editor?.commands?.updateSection({
            padding: value,
          });
        }}
      />
      <div className="mly-mx-0.5 mly-w-px mly-bg-gray-200" />
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
    </BubbleMenu>
  );
}
