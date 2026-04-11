import type { AllowedFieldMode } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  ArrowRightIcon,
  MaximizeIcon,
  SlidersHorizontalIcon,
  SquareRoundCornerIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useEditorRootContext } from '~/components/editor/editor-root-context';
import type { ButtonAttributes } from '~/extensions/button/button';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { SideIcon } from '../icons/side-icon';
import { BubbleButton } from '../interface/bubble-button';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import type { MultiValue, Side } from '../interface/multi-unit-field';
import { MultiUnitField, SIDE_AXES } from '../interface/multi-unit-field';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { ButtonBorderStyleConfig } from './button-border-style-config';
import { PADDING_PRESETS } from './button-padding-style-config';

type ButtonStylePopoverProps = {
  container: FloatingUIContainer;
  editor: Editor;
  onClose?: () => void;
};

export function ButtonStylePopover(props: ButtonStylePopoverProps) {
  const { container, editor, onClose } = props;

  const editorInstance = useEditorInstance(editor);
  const { theme } = useEditorRootContext();
  const buttonTheme = theme.button;

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes('button') as ButtonAttributes;
      const hasBorderWidth =
        attrs.borderTopWidth > 0 ||
        attrs.borderRightWidth > 0 ||
        attrs.borderBottomWidth > 0 ||
        attrs.borderLeftWidth > 0;
      const hasBorderRadius =
        attrs.borderTopLeftRadius > 0 ||
        attrs.borderTopRightRadius > 0 ||
        attrs.borderBottomRightRadius > 0 ||
        attrs.borderBottomLeftRadius > 0;

      return {
        hasBorderStyle: hasBorderWidth || hasBorderRadius,
        paddingMode: attrs.paddingMode,
        paddingTop: attrs.paddingTop ?? buttonTheme?.paddingTop ?? 0,
        paddingRight: attrs.paddingRight ?? buttonTheme?.paddingRight ?? 0,
        paddingBottom: attrs.paddingBottom ?? buttonTheme?.paddingBottom ?? 0,
        paddingLeft: attrs.paddingLeft ?? buttonTheme?.paddingLeft ?? 0,
      };
    },
  });

  const [open, setOpen] = useState(false);
  const [isBorderConfigOpen, setIsBorderConfigOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose?.();
    }

    setOpen(nextOpen);
    setIsBorderConfigOpen(false);
  };

  const handlePaddingModeChange = (nextPaddingMode: AllowedFieldMode) => {
    editorInstance
      .chain()
      .updateButtonAttributes({ paddingMode: nextPaddingMode })
      .run();
  };

  const handlePaddingValuesChange = (nextPaddingValues: MultiValue<Side>) => {
    editorInstance
      .chain()
      .updateButtonAttributes({
        paddingTop: nextPaddingValues.top,
        paddingRight: nextPaddingValues.right,
        paddingBottom: nextPaddingValues.bottom,
        paddingLeft: nextPaddingValues.left,
      })
      .run();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Button Style"
            icon={SlidersHorizontalIcon}
            tooltip="Button Style"
            container={container}
            isActive={open}
          />
        }
      />

      <PopoverPositioner container={container} side="bottom" align="center">
        <PopoverPopup className="mly:w-65 mly:p-1" initialFocus={false}>
          {isBorderConfigOpen && (
            <ButtonBorderStyleConfig
              container={container}
              editor={editor}
              onBack={() => setIsBorderConfigOpen(false)}
            />
          )}

          {!isBorderConfigOpen && (
            <>
              <MultiUnitField
                container={container}
                label="Padding"
                dragAreaIcon={
                  <MaximizeIcon className="mly:size-3.5 mly:text-midnight-gray" />
                }
                mode={state.paddingMode as AllowedFieldMode}
                onModeChange={handlePaddingModeChange}
                values={{
                  top: state.paddingTop,
                  right: state.paddingRight,
                  bottom: state.paddingBottom,
                  left: state.paddingLeft,
                }}
                onValuesChange={handlePaddingValuesChange}
                presets={PADDING_PRESETS}
                min={0}
                max={100}
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

              <Divider type="horizontal" className="mly:-mx-1 mly:my-1" />

              <Button
                variant="ghost"
                className={cn(
                  'mly:w-full mly:justify-between mly:gap-1.5 mly:px-2 mly:font-normal mly:text-gray-500 mly:hover:text-gray-900',
                  state.hasBorderStyle &&
                    'mly:bg-soft-gray/70 mly:text-gray-900'
                )}
                onClick={() => setIsBorderConfigOpen(true)}
              >
                <span className="mly:flex mly:items-center mly:gap-1.5">
                  <SquareRoundCornerIcon className="mly:size-3.5 mly:shrink-0" />
                  Border Style
                </span>
                <ArrowRightIcon className="mly:size-3.5 mly:shrink-0" />
              </Button>
            </>
          )}

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
