import type { Editor } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import { CornerDownLeftIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { useControllableState } from '~/hooks/use-controllable-state';
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

export type TextFieldPopoverAction = {
  icon: LucideIcon;
  tooltip: string;
  onClick: (editor: Editor) => void;
};

type TextFieldPopoverProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  container: FloatingUIContainer;
  value: string;
  onValueChange: (val: string) => void;
  onClose?: () => void;
  placeholder?: string;

  triggerIcon: LucideIcon;
  triggerTooltip: string;
  enterTooltip: string;

  actions?: TextFieldPopoverAction[];
};

export function TextFieldPopover(props: TextFieldPopoverProps) {
  const {
    open: controlledOpen,
    onOpenChange,

    container,
    value = '',
    onValueChange,
    onClose,
    placeholder,
    triggerIcon,
    triggerTooltip,
    enterTooltip,
    actions = [],
  } = props;

  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: false,
    onChange: onOpenChange,
  });

  const editorRef = useRef<Editor | null>(null);

  const handleEnter = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const text = editor.getText();
    onValueChange(text);
    onClose?.();
    setOpen(false);
  }, [onValueChange, onClose, setOpen]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose?.();
      }

      setOpen(nextOpen);
    },
    [onClose, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <BubbleButton
            label={triggerTooltip}
            icon={triggerIcon}
            tooltip={triggerTooltip}
            container={container}
            isActive={open || !!value}
          />
        }
      />

      <PopoverPositioner
        container={container}
        alignOffset={arrowAlignOffset}
        side="bottom"
      >
        <PopoverPopup
          className="mly:flex mly:w-auto mly:gap-0.5"
          finalFocus={false}
        >
          {open && (
            <SkeletonEditor
              editorRef={editorRef}
              content={value}
              onEnter={handleEnter}
              placeholder={placeholder}
            />
          )}

          <BubbleButton
            label={enterTooltip}
            icon={CornerDownLeftIcon}
            onClick={handleEnter}
            tooltip={enterTooltip}
            container={container}
          />

          {actions.length > 0 && <Divider />}
          {actions.map((action, i) => {
            const { tooltip, icon, onClick } = action;

            return (
              <BubbleButton
                key={i}
                label={tooltip}
                tooltip={tooltip}
                container={container}
                icon={icon}
                onClick={() => {
                  const editor = editorRef.current;
                  if (!editor) {
                    return;
                  }

                  onClick(editor);
                }}
              />
            );
          })}
          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
