import {
  VariablePopover,
  VariablePopoverRef,
} from '@/editor/nodes/variable/variable-popover';
import { useMailyContext } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { useOutsideClick } from '@/editor/utils/use-outside-click';
import { CornerDownLeft } from 'lucide-react';
import { forwardRef, HTMLAttributes, useMemo, useState, useRef } from 'react';

type InputAutocompleteProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  onValueChange: (value: string) => void;

  autoCompleteOptions?: string[];
  onSelectOption?: (option: string) => void;

  onOutsideClick?: () => void;
};

export const InputAutocomplete = forwardRef<
  HTMLInputElement,
  InputAutocompleteProps
>((props, ref) => {
  const {
    value = '',
    onValueChange,
    className,
    onOutsideClick,
    onSelectOption,
    autoCompleteOptions = [],
    ...inputProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<VariablePopoverRef>(null);

  useOutsideClick(containerRef, () => {
    onOutsideClick?.();
  });

  return (
    <div className={cn('mly-relative', className)} ref={containerRef}>
      <label className="mly-relative">
        <input
          {...inputProps}
          ref={ref}
          value={value}
          onChange={(e) => {
            onValueChange(e.target.value);
          }}
          type="text"
          placeholder="e.g. items"
          className="mly-h-7 mly-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
          onKeyDown={(e) => {
            if (!popoverRef.current) {
              return;
            }
            const { moveUp, moveDown, select } = popoverRef.current;

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              moveDown();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              moveUp();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              select();
            }
          }}
        />
        <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
          <CornerDownLeft className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
        </div>
      </label>

      {autoCompleteOptions.length > 0 && (
        <div className="mly-absolute mly-left-0 mly-top-8">
          <VariablePopover
            items={autoCompleteOptions.map((option) => {
              return {
                name: option,
              };
            })}
            onSelectItem={(item) => {
              onValueChange(item.name);
              onSelectOption?.(item.name);
            }}
            ref={popoverRef}
          />
        </div>
      )}
    </div>
  );
});

InputAutocomplete.displayName = 'InputAutocomplete';
