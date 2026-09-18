import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from './tooltip';

export type BubbleButtonProps = ComponentPropsWithRef<'button'> & {
  isActive?: boolean;
  label: string;
  render?: useRender.RenderProp;
  container?: FloatingUIContainer;
  tooltip?: string;
} & (
    | { children: ReactNode; icon?: never }
    | { children?: never; icon: LucideIcon }
  );

export function BubbleButton(props: BubbleButtonProps) {
  const {
    children,
    container,
    icon: Icon,
    isActive,
    label,
    render,
    tooltip,
    ...rest
  } = props;

  const content = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        'aria-label': label,
        'aria-pressed': isActive,
        'data-active': isActive ? '' : undefined,
        'data-mly-bubble-button': '',
        onMouseDown: (event: MouseEvent<HTMLButtonElement>) =>
          event.preventDefault(),
        type: 'button',
      } as ComponentPropsWithRef<'button'>,
      rest,
      { children: children ?? (Icon ? <Icon size={14} /> : null) }
    ),
  });

  if (!tooltip) {
    return content;
  }

  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger render={content} />
      <TooltipPositioner container={container}>
        <TooltipPopup>
          {tooltip}
          <TooltipArrow />
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
}
