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
  const [selectedIndex, setSelectedIndex] = useState(0);

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
            setSelectedIndex(0);
            onValueChange(e.target.value);
          }}
          type="text"
          placeholder="e.g. items"
          className="mly-h-7 mly-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.min(prev + 1, autoCompleteOptions.length - 1)
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();

              const _value = autoCompleteOptions[selectedIndex];
              onValueChange(_value);
              onSelectOption?.(_value);
            }
          }}
        />
        <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
          <CornerDownLeft className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
        </div>
      </label>

      {autoCompleteOptions.length > 0 && (
        <div className="mly-absolute mly-left-0 mly-top-8 mly-z-10 mly-w-full mly-rounded-lg mly-bg-white mly-p-0.5 mly-shadow-md">
          {autoCompleteOptions.map((option, index) => (
            <button
              type="button"
              key={option}
              className="mly-w-full mly-truncate mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-midnight-gray aria-selected:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
              onClick={() => {
                onValueChange(option);
                onSelectOption?.(option);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              aria-selected={selectedIndex === index}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

InputAutocomplete.displayName = 'InputAutocomplete';
