import type { AllowedFieldMode } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import {
  ArrowRightIcon,
  MaximizeIcon,
  MoveIcon,
  SlidersHorizontalIcon,
  SquareRoundCornerIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useSectionState } from '~/hooks/use-section-state';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { PADDING_PRESETS } from '../button-bubble-menu/button-padding-style-config';
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
import { SectionBorderStyleConfig } from './section-border-style-config';

const MARGIN_PRESETS = [
  { value: 0, label: 'None' },
  { value: 8, label: 'Small' },
  { value: 16, label: 'Medium' },
  { value: 32, label: 'Large' },
];

type SectionStylePopoverProps = {
  container: FloatingUIContainer;
  editor: Editor;
  onClose?: () => void;
};

export function SectionStylePopover(props: SectionStylePopoverProps) {
  const { container, editor, onClose } = props;

  const editorInstance = useEditorInstance(editor);
  const state = useSectionState(editor);

  const hasBorderWidth =
    state.borderTopWidth > 0 ||
    state.borderRightWidth > 0 ||
    state.borderBottomWidth > 0 ||
    state.borderLeftWidth > 0;
  const hasBorderRadius =
    state.borderTopLeftRadius > 0 ||
    state.borderTopRightRadius > 0 ||
    state.borderBottomRightRadius > 0 ||
    state.borderBottomLeftRadius > 0;
  const hasBorderStyle = hasBorderWidth || hasBorderRadius;

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
      .updateSection({ paddingMode: nextPaddingMode })
      .run();
  };

  const handlePaddingValuesChange = (nextPaddingValues: MultiValue<Side>) => {
    editorInstance
      .chain()
      .updateSection({
        paddingTop: nextPaddingValues.top,
        paddingRight: nextPaddingValues.right,
        paddingBottom: nextPaddingValues.bottom,
        paddingLeft: nextPaddingValues.left,
      })
      .run();
  };

  const handleMarginModeChange = (nextMarginMode: AllowedFieldMode) => {
    editorInstance.chain().updateSection({ marginMode: nextMarginMode }).run();
  };

  const handleMarginValuesChange = (nextMarginValues: MultiValue<Side>) => {
    editorInstance
      .chain()
      .updateSection({
        marginTop: nextMarginValues.top,
        marginRight: nextMarginValues.right,
        marginBottom: nextMarginValues.bottom,
        marginLeft: nextMarginValues.left,
      })
      .run();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Section Style"
            icon={SlidersHorizontalIcon}
            tooltip="Section Style"
            container={container}
            isActive={open}
          />
        }
      />

      <PopoverPositioner container={container} side="bottom" align="center">
        <PopoverPopup className="mly:w-65 mly:p-1" initialFocus={false}>
          {isBorderConfigOpen && (
            <SectionBorderStyleConfig
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

              <MultiUnitField
                container={container}
                label="Margin"
                dragAreaIcon={
                  <MoveIcon className="mly:size-3.5 mly:text-midnight-gray" />
                }
                mode={state.marginMode as AllowedFieldMode}
                onModeChange={handleMarginModeChange}
                values={{
                  top: state.marginTop,
                  right: state.marginRight,
                  bottom: state.marginBottom,
                  left: state.marginLeft,
                }}
                onValuesChange={handleMarginValuesChange}
                presets={MARGIN_PRESETS}
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
                  hasBorderStyle && 'mly:bg-soft-gray/70 mly:text-gray-900'
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
