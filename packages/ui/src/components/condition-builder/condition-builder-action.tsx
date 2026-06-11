import { Select } from '@base-ui/react/select';

import { useConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderActionProps = Omit<
  Select.Root.Props<string>,
  'value' | 'onValueChange'
>;

export function ConditionBuilderAction(props: ConditionBuilderAction.Props) {
  const { action, onActionChange } = useConditionBuilderContext();

  return (
    <Select.Root
      value={action}
      onValueChange={(value) => onActionChange(value ?? '')}
      {...props}
    />
  );
}

export namespace ConditionBuilderAction {
  export type Props = ConditionBuilderActionProps;
}
