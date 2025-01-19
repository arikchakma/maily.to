import { useId } from 'react';
import { ChevronDownIcon, type LucideIcon } from 'lucide-react';
import { cn } from '~/utils/classname';

type SelectProps = {
  label: string;
  options: {
    value: string;
    label: string;
  }[];

  value: string;
  onValueChange: (value: string) => void;

  className?: string;

  icon?: LucideIcon;
  iconClassName?: string;
};

export function Select(props: SelectProps) {
  const {
    label,
    options,
    value,
    onValueChange,
    className,
    icon: Icon,
    iconClassName,
  } = props;

  const selectId = `mly${useId()}`;

  return (
    <div className="relative">
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>

      {Icon && (
        <div className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-left-2 mly-z-20 mly-flex mly-items-center">
          <Icon className={cn('mly-size-3', iconClassName)} />
        </div>
      )}

      <select
        id={selectId}
        className={cn(
          'mly-flex mly-min-h-7 mly-max-w-max mly-appearance-none mly-items-center mly-rounded-md mly-px-1.5 mly-py-0.5 mly-pr-7 mly-text-sm mly-text-midnight-gray mly-ring-offset-white mly-transition-colors hover:mly-bg-soft-gray focus-visible:mly-relative focus-visible:mly-z-10 focus-visible:mly-outline-none focus-visible:mly-ring-2 focus-visible:mly-ring-gray-400 focus-visible:mly-ring-offset-2 active:mly-bg-soft-gray',
          !!Icon && 'mly-pl-7',
          className
        )}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-right-0 mly-z-10 mly-flex mly-h-full mly-w-7 mly-items-center mly-justify-center mly-text-gray-600 peer-disabled:mly-opacity-50">
        <ChevronDownIcon
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          role="img"
        />
      </span>
    </div>
  );
}
