import { ArrowUpRight, CornerDownLeft, Link, LucideIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { BaseButton } from '../base-button';
import { useRef, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';

type LinkInputPopoverProps = {
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  icon?: LucideIcon;
  tooltip?: string;
};

export function LinkInputPopover(props: LinkInputPopoverProps) {
  const {
    defaultValue = '',
    onValueChange,
    tooltip,
    icon: Icon = Link,
  } = props;

  const defaultUrl = defaultValue.startsWith('https://')
    ? defaultValue.replace('https://', '')
    : defaultValue;

  const [isOpen, setIsOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const popoverButton = (
    <PopoverTrigger asChild>
      <BaseButton
        variant="ghost"
        size="sm"
        type="button"
        className="mly-size-7"
        data-state={!!defaultUrl}
      >
        <Icon className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5] mly-text-midnight-gray" />
      </BaseButton>
    </PopoverTrigger>
  );

  const normalizeToHttps = (value: string) => {
    if (value.startsWith('https://')) {
      return value;
    }

    return `https://${value}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{popoverButton}</TooltipTrigger>
          <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        popoverButton
      )}

      <PopoverContent
        align="end"
        side="top"
        className="mly-w-max mly-rounded-none mly-border-none mly-bg-transparent !mly-p-0 mly-shadow-none"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = linkInputRef.current;
            if (!input) {
              return;
            }

            let value = normalizeToHttps(input.value);
            onValueChange?.(value);
            setIsOpen(false);
          }}
        >
          <label className="relative">
            <div className="mly-isolate mly-flex mly-rounded-lg">
              <span className="-mly-z-10 mly-inline-flex mly-items-center mly-rounded-s-lg mly-border mly-border-gray-300 mly-bg-gray-50 mly-px-3 mly-text-sm mly-text-gray-700">
                https://
              </span>
              <input
                value={defaultUrl}
                onChange={(e) => {
                  let value = normalizeToHttps(e.target.value);
                  onValueChange?.(value);
                }}
                ref={linkInputRef}
                type="text"
                className="-mly-ms-px mly-block mly-h-8 mly-w-52 mly-rounded-lg mly-rounded-s-none mly-border mly-border-gray-300 mly-px-2 mly-py-1.5 mly-pr-6 mly-text-sm mly-shadow-sm mly-outline-none placeholder:mly-text-gray-400"
                placeholder="maily.to/"
              />
            </div>

            <div className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-right-1.5 mly-flex mly-items-center">
              <CornerDownLeft className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
            </div>
          </label>
        </form>
      </PopoverContent>
    </Popover>
  );
}
