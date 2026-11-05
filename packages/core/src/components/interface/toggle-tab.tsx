import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { LucideIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from './tooltip';

export type ToggleTabGroupProps = Omit<ToggleGroupPrimitive.Props, 'multiple'>;

export function ToggleTabGroup(props: ToggleTabGroupProps) {
  return <ToggleGroupPrimitive {...props} data-mly-toggle-tab-group="" />;
}

export type ToggleTabItemProps = {
  icon: LucideIcon;
  label: string;
} & Omit<TogglePrimitive.Props, 'children'> &
  (
    | { container?: never; tooltip?: never }
    | { container: FloatingUIContainer; tooltip: string }
  );

export function ToggleTabItem(props: ToggleTabItemProps) {
  const { container, icon: Icon, label, tooltip, ...rest } = props;

  const content = (
    <TogglePrimitive {...rest} aria-label={label} data-mly-toggle-tab="">
      <Icon size={14} />
    </TogglePrimitive>
  );

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
