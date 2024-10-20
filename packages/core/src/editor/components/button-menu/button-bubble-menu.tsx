import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenuButton } from '../bubble-menu-button';
import { TooltipProvider } from '../ui/tooltip';
import { useButtonState } from './use-button-state';
import { Select } from '../ui/select';
import {
  AllowedButtonBorderRadius,
  allowedButtonBorderRadius,
  AllowedButtonVariant,
  allowedButtonVariant,
} from '@/editor/nodes/button/button';

export function ButtonBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'button');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('button');
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
    pluginKey: 'buttonBubbleMenu',
  };

  const state = useButtonState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <div className="mly-flex mly-items-stretch mly-text-red-400">
        <input
          value={state.buttonText}
          onChange={(e) => {
            // editor.commands.updateButton({
            //   text: e.target.value,
            // });
            editor.chain().updateButton({ text: e.target.value }).focus().run();
          }}
        />
        <Select
          label="Border Radius"
          value={state.buttonBorderRadius}
          options={allowedButtonBorderRadius.map((value) => ({
            value,
            label: value,
          }))}
          onValueChange={(value) => {
            editor
              .chain()
              .updateButton({
                borderRadius: value as AllowedButtonBorderRadius,
              })
              .focus()
              .run();
          }}
        />
        <Select
          label="Style"
          value={state.buttonVariant}
          options={allowedButtonVariant.map((value) => ({
            value,
            label: value,
          }))}
          onValueChange={(value) => {
            editor
              .chain()
              .updateButton({
                variant: value as AllowedButtonVariant,
              })
              .focus()
              .run();
          }}
        />
      </div>
    </BubbleMenu>
  );
}
