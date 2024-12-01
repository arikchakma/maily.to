import { useId } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/editor/utils/classname';
import { LucideIcon } from 'lucide-react';
import { SVGIcon } from '../icons/grid-lines';

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

  icon?: LucideIcon | SVGIcon;
  iconClassName?: string;
};

export function Select(props: SelectProps) {
  const {
    label,
    options,
    value,
    onValueChange,
    tooltip,
    className,
    icon: Icon,
    iconClassName,
  } = props;

  const selectId = `mly${useId()}`;

  const content = (
    <div className="relative">
      <label htmlFor={selectId} className="mly-sr-only">
        {label}
      </label>

      {Icon && (
        <div className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-left-2 mly-flex mly-items-center">
          <Icon className={cn('mly-size-3', iconClassName)} />
        </div>
      )}

      <select
        id={selectId}
        className={cn(
          'mly-flex mly-min-h-7 mly-max-w-max mly-appearance-none mly-items-center mly-rounded-md mly-px-1.5 mly-py-0.5 mly-text-sm mly-text-midnight-gray mly-ring-offset-white mly-transition-colors hover:mly-bg-soft-gray focus:mly-outline-none focus-visible:mly-outline-none active:mly-bg-soft-gray',
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
