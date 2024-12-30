import { forwardRef } from 'react';
import { cn } from '@/editor/utils/classname';
import { type LucideIcon } from 'lucide-react';
import { SVGIcon } from '../icons/grid-lines';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '@/editor/utils/constants';

type NumberInputProps = {
  value: number;
  onValueChange: (value: number) => void;
  icon?: LucideIcon | SVGIcon;
  max?: number;

  tooltip?: string;
};

export const NumberInput = forwardRef<HTMLLabelElement, NumberInputProps>(
  (props, ref) => {
    const { value, onValueChange, icon: Icon, max, tooltip } = props;

    const content = (
      <label
        ref={ref}
        className="mly-relative mly-flex mly-items-center mly-justify-center"
      >
        {Icon ? (
          <Icon className="mly-absolute mly-left-1.5 mly-size-3.5" />
        ) : null}
        <input
          {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
          min={0}
          {...(max ? { max } : {})}
          type="number"
          // Error: https://github.com/facebook/react/issues/9402
          // adding `+ ''` to convert number to string so that number don't have leading zero(0)
          value={value + ''}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className={cn(
            'hide-number-controls focus-visible:outline-none mly-h-auto mly-max-w-12 mly-border-0 mly-border-none mly-p-1 mly-text-center mly-text-sm mly-tabular-nums mly-outline-none',
            Icon ? 'mly-pl-[26px]' : ''
          )}
        />
      </label>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{content}</span>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
        </Tooltip>
      );
    }

    return content;
  }
);

NumberInput.displayName = 'NumberInput';
