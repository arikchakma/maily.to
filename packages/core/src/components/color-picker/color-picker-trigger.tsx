import type { useRender } from '@base-ui/react/use-render';
import { ChevronDownIcon, HighlighterIcon } from 'lucide-react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';

export type ColorTriggerProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children'
> & {
  color: string;
  container: FloatingUIContainer;
  group: 'background' | 'text';
  isActive?: boolean;
  label: string;
  render?: useRender.RenderProp;
  tooltip: string;
};

export function ColorTrigger(props: ColorTriggerProps) {
  const { color, container, group, isActive, label, render, tooltip, ...rest } =
    props;

  const style =
    group === 'background'
      ? ({
          backgroundColor: color || undefined,
          '--mly-dynamic-text-color-background': color || undefined,
        } as CSSProperties)
      : { color: color || undefined };

  return (
    <BubbleButton
      {...rest}
      container={container}
      data-variant="color"
      isActive={isActive}
      label={label}
      render={render}
      tooltip={tooltip}
    >
      <span data-group={group} data-mly-color-trigger="" style={style}>
        {group === 'background' ? (
          <HighlighterIcon data-mly-dynamic-text-color="" size={12} />
        ) : (
          <span data-mly-color-trigger-letter="">A</span>
        )}
      </span>
      <ChevronDownIcon size={12} />
    </BubbleButton>
  );
}
