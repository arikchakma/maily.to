import { Select } from '@base-ui/react/select';

import { useConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderOperatorProps = Omit<
  Select.Root.Props<string>,
  'value' | 'onValueChange'
>;

export function ConditionBuilderOperator(
  props: ConditionBuilderOperator.Props
) {
  const { operator, onOperatorChange } = useConditionBuilderContext();

  return (
    <Select.Root
      value={operator}
      onValueChange={(value) => {
        if (value !== null) {
          onOperatorChange(value);
        }
      }}
      {...props}
    />
  );
}

export namespace ConditionBuilderOperator {
  export type Props = ConditionBuilderOperatorProps;
}
