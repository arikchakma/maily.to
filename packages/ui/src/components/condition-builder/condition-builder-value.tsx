import type { ComponentProps } from 'react';

import { useConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderValueProps = Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'type'
>;

export function ConditionBuilderValue(props: ConditionBuilderValue.Props) {
  const { value, onValueChange, operatorNeedsValue } =
    useConditionBuilderContext();

  if (!operatorNeedsValue) {
    return null;
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        onValueChange(e.target.value);
      }}
      {...props}
    />
  );
}

export namespace ConditionBuilderValue {
  export type Props = ConditionBuilderValueProps;
}
