import { Braces, ChevronUp, CornerDownLeft, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useRef, useState } from 'react';
import { cn } from '../utils/classname';

type ShowPopoverProps = {
  showIfKey?: string;
  onShowIfKeyValueChange?: (when: string) => void;
};

export function ShowPopover(props: ShowPopoverProps) {
  const { showIfKey, onShowIfKeyValueChange } = props;

  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidWhenKey = showIfKey !== undefined && showIfKey !== '';

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'mly-flex mly-items-center mly-gap-1 mly-rounded-md mly-px-1.5 mly-text-sm hover:mly-bg-soft-gray data-[state=open]:mly-bg-soft-gray',
          showIfKey && 'mly-bg-soft-gray'
        )}
      >
        <Eye className="mly-h-4 mly-w-4 mly-stroke-[2.5] mly-text-midnight-gray" />
      </PopoverTrigger>
      <PopoverContent
        className="mly-flex mly-w-max mly-rounded-lg !mly-p-0.5"
        side="top"
        sideOffset={8}
        align="end"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <span className="mly-flex mly-items-center mly-px-1.5 mly-text-sm mly-leading-none">
          Show if
        </span>
        {!isUpdatingKey && (
          <button
            className={cn(
              'mly-flex mly-h-7 mly-min-w-28 mly-items-center mly-gap-1.5 mly-rounded-md mly-border mly-px-2 mly-font-mono mly-text-sm hover:mly-bg-soft-gray',
              !isValidWhenKey &&
                'mly-border-rose-400 mly-bg-rose-50 mly-text-rose-600 hover:mly-bg-rose-100'
            )}
            onClick={() => {
              setIsUpdatingKey(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            <Braces className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-rose-600" />
            <span>{showIfKey}</span>
          </button>
        )}
        {isUpdatingKey && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsUpdatingKey(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsUpdatingKey(false);
              }
            }}
          >
            <label className="mly-relative">
              <input
                value={showIfKey || ''}
                onChange={(e) => {
                  onShowIfKeyValueChange?.(e.target.value);
                }}
                onBlur={() => {
                  setIsUpdatingKey(false);
                }}
                ref={inputRef}
                type="text"
                placeholder="e.g. key"
                className="mly-h-7 mly-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
              />
              <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
                <CornerDownLeft className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
              </div>
            </label>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
