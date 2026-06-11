import type { ComponentProps } from 'react';

import { useConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderClearProps = Omit<ComponentProps<'button'>, 'type'>;

export function ConditionBuilderClear(props: ConditionBuilderClear.Props) {
  const { onClick, ...rest } = props;
  const { onClear } = useConditionBuilderContext();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClear();
        onClick?.(e);
      }}
      {...rest}
    />
  );
}

export namespace ConditionBuilderClear {
  export type Props = ConditionBuilderClearProps;
}
