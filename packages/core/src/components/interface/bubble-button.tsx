import type { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import type { ButtonProps } from './button';
import { Button } from './button';
import {
  Tooltip,
  ToolTipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from './tooltip';

type BubbleButtonProps = {
  label: string;
  isActive?: boolean;
} & ButtonProps &
  (
    | {
        tooltip?: never;
        container?: never;
      }
    | {
        tooltip: string;
        container: FloatingUIContainer;
      }
  ) &
  (
    | { icon: LucideIcon; children?: never }
    | { icon?: never; children: React.ReactNode }
  );

export const BubbleButton = forwardRef<HTMLButtonElement, BubbleButtonProps>(
  (props, ref) => {
    const {
      label,
      icon: Icon,
      size = 'icon',
      variant = 'ghost',
      tooltip,
      isActive,
      container,
      children,
      className,
      ...rest
    } = props;

    const content = (
      <Button
        size={size}
        variant={variant}
        aria-label={label}
        type="button"
        ref={ref}
        className={cn(
          'mly:shrink-0 mly:rounded-bubble-button! mly:has-[+.mly-divider]:rounded-r-sm mly:[.mly-divider+&]:rounded-l-sm',
          isActive && 'mly:bg-soft-gray/70 mly:text-gray-900',
          className
        )}
        {...rest}
      >
        {children ||
          (Icon && <Icon className="mly:size-3.5 mly:disabled:opacity-50" />)}
        <span className="mly:sr-only">{label}</span>
      </Button>
    );

    if (!tooltip) {
      return content;
    }

    return (
      <Tooltip>
        <TooltipTrigger render={content} />
        <TooltipPositioner container={container}>
          <TooltipPopup className="mly:whitespace-nowrap">
            {tooltip}
            <ToolTipArrow />
          </TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
    );
  }
);

BubbleButton.displayName = 'BubbleButton';
