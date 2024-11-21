import { cn } from '@/editor/utils/classname';
import { CornerDownLeft } from 'lucide-react';
import { useRef, HTMLAttributes, useMemo, useState } from 'react';

type InputAutocompleteProps = HTMLAttributes<HTMLInputElement> & {
  value: string;
  onValueChange: (value: string) => void;

  autoCompleteOptions?: string[];
  onSelectOption?: (option: string) => void;
};

export function InputAutocomplete(props: InputAutocompleteProps) {
  const {
    value = '',
    onValueChange,
    className,
    onBlur: onInputBlur,
    onSelectOption,
    autoCompleteOptions = [],
    ...inputProps
  } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredAutoCompleteOptions = useMemo(() => {
    const filteredOptions = autoCompleteOptions
      .filter((option) => option.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 4);
    if (value.length > 0 && !filteredOptions.includes(value)) {
      filteredOptions.push(value);
    }

    return filteredOptions;
  }, [autoCompleteOptions, value]);

  return (
    <div className={cn('mly-relative', className)}>
      <label className="mly-relative">
        <input
          {...inputProps}
          value={value}
          onChange={(e) => {
            setSelectedIndex(0);
            onValueChange(e.target.value);
          }}
          onBlur={onInputBlur}
          ref={inputRef}
          type="text"
          placeholder="e.g. items"
          className="mly-h-7 mly-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.min(prev + 1, filteredAutoCompleteOptions.length - 1)
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();

              const _value = filteredAutoCompleteOptions[selectedIndex];
              onValueChange(_value);
              inputRef.current?.focus();
              onSelectOption?.(_value);
            }
          }}
        />
        <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
          <CornerDownLeft className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
        </div>
      </label>

      {filteredAutoCompleteOptions.length > 0 && (
        <div className="mly-absolute mly-left-0 mly-top-8 mly-z-10 mly-w-full mly-rounded-lg mly-bg-white mly-p-0.5 mly-shadow-md">
          {filteredAutoCompleteOptions.map((option, index) => (
            <button
              type="button"
              key={option}
              className="mly-w-full mly-truncate mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-midnight-gray focus:mly-bg-soft-gray focus:mly-outline-none aria-selected:mly-bg-soft-gray"
              onClick={() => {
                onValueChange(option);
                inputRef.current?.focus();
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
}
