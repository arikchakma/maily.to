import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export type SelectTriggerProps = SelectPrimitive.Trigger.Props;

export function SelectTrigger(props: SelectTriggerProps) {
  const { children, ...rest } = props;

  return (
    <SelectPrimitive.Trigger {...rest} data-mly-select-trigger="">
      {children}
      <span data-mly-select-icon="">
        <SelectPrimitive.Icon render={<ChevronDownIcon size={16} />} />
      </span>
    </SelectPrimitive.Trigger>
  );
}

export type SelectPositionerProps = SelectPrimitive.Positioner.Props & {
  container?: FloatingUIContainer;
};

export function SelectPositioner(props: SelectPositionerProps) {
  const {
    align = 'start',
    alignItemWithTrigger = false,
    container,
    side = 'bottom',
    sideOffset = 2,
    ...rest
  } = props;

  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        side={side}
        sideOffset={sideOffset}
        {...rest}
        data-mly-select-positioner=""
      />
    </SelectPrimitive.Portal>
  );
}

export type SelectContentProps = SelectPrimitive.Popup.Props;

export function SelectContent(props: SelectContentProps) {
  const { children, ...rest } = props;

  return (
    <SelectPrimitive.Popup {...rest} data-mly-select-content="">
      <SelectPrimitive.List
        data-axis="y"
        data-mly-scroll-fade=""
        data-mly-select-list=""
      >
        {children}
      </SelectPrimitive.List>
    </SelectPrimitive.Popup>
  );
}

export type SelectItemProps = SelectPrimitive.Item.Props;

export function SelectItem(props: SelectItemProps) {
  const { children, ...rest } = props;

  return (
    <SelectPrimitive.Item {...rest} data-mly-select-item="">
      <SelectPrimitive.ItemIndicator data-mly-select-indicator="">
        <CheckIcon size={14} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
