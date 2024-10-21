import { useId } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/editor/utils/classname';

type SelectProps = {
  label: string;
  options: {
    value: string;
    label: string;
  }[];

  value: string;
  onValueChange: (value: string) => void;

  tooltip?: string;
  className?: string;
};

export function Select(props: SelectProps) {
  const { label, options, value, onValueChange, tooltip, className } = props;

  const selectId = `mly${useId()}`;

  const content = (
    <div>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>

      <select
        id={selectId}
        className={cn(
          'mly-flex mly-min-h-7 mly-max-w-max mly-appearance-none mly-items-center mly-rounded-md mly-px-1.5 mly-py-0.5 mly-text-sm mly-leading-none mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-outline-none active:mly-bg-soft-gray',
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
    </div>
  );

  if (!tooltip) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
