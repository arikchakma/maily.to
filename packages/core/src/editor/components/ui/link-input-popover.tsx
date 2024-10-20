import { ArrowUpRight, Link } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { BaseButton } from '../base-button';
import { useRef, useState } from 'react';

type LinkInputPopoverProps = {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function LinkInputPopover(props: LinkInputPopoverProps) {
  const { defaultValue = '', onValueChange } = props;

  const [isOpen, setIsOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <BaseButton
          variant="ghost"
          size="sm"
          type="button"
          className="mly-size-7"
          data-state={!!defaultValue}
        >
          <Link className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5] mly-text-midnight-gray" />
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="mly-w-max mly-rounded-lg !mly-p-0.5"
        sideOffset={10}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = linkInputRef.current;
            if (!input) {
              return;
            }

            onValueChange?.(input.value);
            setIsOpen(false);
          }}
        >
          <label className="relative">
            <input
              value={defaultValue}
              onChange={(e) => {
                onValueChange?.(e.target.value);
              }}
              ref={linkInputRef}
              type="url"
              className="mly-h-7 mly-max-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
            />
            <div className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
              <ArrowUpRight className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
            </div>
          </label>
        </form>
      </PopoverContent>
    </Popover>
  );
}
