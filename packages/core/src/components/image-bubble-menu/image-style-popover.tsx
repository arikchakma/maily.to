import {
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
  parseWidthToPercentage,
} from '@maily-to/shared';
import { useMailyId } from '@maily-to/ui';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  ArrowRightIcon,
  RulerDimensionLineIcon,
  SlidersHorizontalIcon,
  SquareRoundCornerIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { BubbleButton } from '../interface/bubble-button';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { UnitField } from '../interface/unit-field';
import { BorderStyleConfig } from './border-style-config';

const _WIDTH_PRESETS = [
  {
    value: 25,
    label: 'Quarter Width',
  },
  {
    value: 33,
    label: 'Third Width',
  },
  {
    value: 50,
    label: 'Half Width',
  },
  {
    value: 100,
    label: 'Full Width',
  },
];

type ImageStylePopoverProps = {
  container: FloatingUIContainer;
  editor: Editor;
  onClose?: () => void;
};

export function ImageStylePopover(props: ImageStylePopoverProps) {
  const { container, editor, onClose } = props;

  const editorInstance = useEditorInstance(editor);
  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes('image');
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
        width: parseWidthToPercentage(attrs.width, 100),
        hasBorderStyle: hasBorderWidth || hasBorderRadius,
      };
    },
  });

  const [open, setOpen] = useState(false);

  const widthInputId = useMailyId();

  const [width, setWidth] = useState(state.width);
  const [isBorderConfigOpen, setIsBorderConfigOpen] = useState(false);

  const handleWidthChange = (nextWidth: number) => {
    setWidth(nextWidth);
    editorInstance
      .chain()
      .updateAttributes('image', { width: `${nextWidth}%` })
      .run();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose?.();
    }

    setOpen(nextOpen);
    setWidth(state.width);
    setIsBorderConfigOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Image Style"
            icon={SlidersHorizontalIcon}
            tooltip="Image Style"
            container={container}
            isActive={open}
          />
        }
      />

      <PopoverPositioner container={container} side="bottom" align="center">
        <PopoverPopup className="mly:w-65 mly:p-1" initialFocus={false}>
          {isBorderConfigOpen && (
            <BorderStyleConfig
              container={container}
              editor={editor}
              onBack={() => setIsBorderConfigOpen(false)}
            />
          )}

          {!isBorderConfigOpen && (
            <>
              <div className="mly:flex mly:w-full mly:items-center mly:justify-between mly:gap-2.5 mly:pl-1">
                <label
                  className="mly:pl-1 mly:text-sm mly:text-gray-500"
                  htmlFor={widthInputId}
                >
                  Width
                </label>
                <UnitField
                  container={container}
                  id={widthInputId}
                  suffix="%"
                  min={MIN_IMAGE_WIDTH_PERCENTAGE}
                  max={MAX_IMAGE_WIDTH_PERCENTAGE}
                  value={width}
                  onValueChange={setWidth}
                  onValueCommitted={handleWidthChange}
                  wrapperClassName="mly:w-20"
                  dragAreaIcon={
                    <RulerDimensionLineIcon className="mly:size-3.5 mly:text-midnight-gray" />
                  }
                />
              </div>

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
