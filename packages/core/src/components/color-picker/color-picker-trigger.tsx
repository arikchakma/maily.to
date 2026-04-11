import { ChevronDownIcon, HighlighterIcon } from 'lucide-react';
import React from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { BubbleButton } from '../interface/bubble-button';
import type { ButtonProps } from '../interface/button';

type ColorTriggerProps = {
  container: FloatingUIContainer;
  label: string;
  tooltip: string;
  active: boolean;
} & (
  | {
      group: 'background';
      backgroundColor: string;
      textColor?: never;
    }
  | {
      group: 'text';
      textColor: string;
      backgroundColor?: never;
    }
) &
  ButtonProps;

export const ColorTrigger = React.forwardRef<
  React.ComponentRef<typeof BubbleButton>,
  ColorTriggerProps
>((props, ref) => {
  const {
    container,
    label,
    tooltip,
    active,
    group,
    backgroundColor,
    textColor,
    ...rest
  } = props;

  return (
    <BubbleButton
      label={label}
      size="default"
      className="mly:group/picker mly:gap-1 mly:px-1.5"
      isActive={active}
      tooltip={tooltip}
      container={container}
      ref={ref}
      {...rest}
    >
      <div
        className={cn(
          'mly:flex mly:h-5 mly:w-5 mly:items-center mly:justify-center mly:rounded-lg mly:border mly:border-gray-200 mly:bg-white mly:text-xs mly:group-hover/picker:border-gray-300',
          group === 'text' ? 'mly:font-normal' : 'mly:font-semibold'
        )}
        style={
          group === 'background'
            ? backgroundColor
              ? {
                  backgroundColor,
                  '--mly-dynamic-text-color-background': backgroundColor,
                }
              : {}
            : textColor
              ? { color: textColor }
              : {}
        }
      >
        {group === 'background' ? (
          <HighlighterIcon className="mly:size-3 mly:shrink-0 mly:dynamic-text-color" />
        ) : (
          <span className="mly:relative mly:-top-px mly:leading-none">A</span>
        )}
      </div>
      <ChevronDownIcon className="mly:size-3 mly:shrink-0" />
    </BubbleButton>
  );
});

ColorTrigger.displayName = 'ColorTrigger';
