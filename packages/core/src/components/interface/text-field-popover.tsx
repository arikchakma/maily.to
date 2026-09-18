import type { Editor } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import { CornerDownLeftIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { arrowAlignOffset } from '~/utils/base-ui';

import { SkeletonEditor } from '../skeleton-editor/skeleton-editor';
import { BubbleButton } from './bubble-button';
import { Divider } from './divider';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from './popover';
import { TooltipProvider } from './tooltip';

export type TextFieldPopoverAction = {
  icon: LucideIcon;
  onClick: (value: string) => void;
  tooltip: string;
};

export type TextFieldPopoverProps = {
  actions?: TextFieldPopoverAction[];
  container: FloatingUIContainer;
  enterTooltip: string;
  onClose?: () => void;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  triggerIcon: LucideIcon;
  triggerTooltip: string;
  value: string;
};

export function TextFieldPopover(props: TextFieldPopoverProps) {
  const {
    actions = [],
    container,
    enterTooltip,
    onClose,
    onValueChange,
    placeholder,
    triggerIcon,
    triggerTooltip,
    value,
  } = props;

  const [open, setOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose?.();
    }

    setOpen(nextOpen);
  };

  const handleEnter = () => {
    const instance = editorRef.current;
    if (!instance) {
      return;
    }

    onValueChange(instance.getText() || null);
    handleOpenChange(false);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <BubbleButton
        container={container}
        icon={triggerIcon}
        isActive={open || Boolean(value)}
        label={triggerTooltip}
        render={<PopoverTrigger />}
        tooltip={triggerTooltip}
      />

      <PopoverPositioner
        alignOffset={arrowAlignOffset}
        container={container}
        side="bottom"
      >
        <PopoverPopup data-variant="text-field" finalFocus={false}>
          <TooltipProvider>
            <div data-mly-text-field="">
              {open ? (
                <SkeletonEditor
                  content={value}
                  editorRef={editorRef}
                  onEnter={handleEnter}
                  placeholder={placeholder}
                />
              ) : null}

              <BubbleButton
                container={container}
                icon={CornerDownLeftIcon}
                label={enterTooltip}
                onClick={handleEnter}
                tooltip={enterTooltip}
              />

              {actions.length > 0 ? <Divider /> : null}

              {actions.map((action) => (
                <BubbleButton
                  container={container}
                  icon={action.icon}
                  key={action.tooltip}
                  label={action.tooltip}
                  onClick={() => {
                    action.onClick(editorRef.current?.getText() ?? '');
                    handleOpenChange(false);
                  }}
                  tooltip={action.tooltip}
                />
              ))}
            </div>
          </TooltipProvider>

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
