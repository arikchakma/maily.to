import type { ComponentProps } from 'react';

import { useConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderFieldProps = Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'type'
>;

export function ConditionBuilderField(props: ConditionBuilderField.Props) {
  const { field, onFieldChange } = useConditionBuilderContext();

  return (
    <input
      type="text"
      value={field}
      onChange={(e) => {
        onFieldChange(e.target.value);
      }}
      {...props}
    />
  );
}

export namespace ConditionBuilderField {
  export type Props = ConditionBuilderFieldProps;
}
