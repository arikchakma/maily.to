import { useId } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type SelectProps = {
  label: string;
  options: {
    value: string;
    label: string;
  }[];

  value: string;
  onValueChange: (value: string) => void;

  tooltip?: string;
};

export function Select(props: SelectProps) {
  const { label, options, value, onValueChange, tooltip } = props;

  const selectId = `mly${useId()}`;

  const content = (
    <div>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>

      <select
        id={selectId}
        className="mly-flex mly-min-h-7 mly-max-w-max mly-appearance-none mly-items-center mly-rounded-md mly-px-1.5 mly-py-0.5 mly-text-sm mly-capitalize mly-leading-none mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-outline-none active:mly-bg-soft-gray"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="mly-capitalize"
          >
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
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
