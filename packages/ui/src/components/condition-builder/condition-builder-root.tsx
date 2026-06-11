import * as React from 'react';

import type { ConditionBuilderContext as ConditionBuilderContextType } from './condition-builder-context';
import { ConditionBuilderContext } from './condition-builder-context';

export type ConditionBuilderRootProps = React.ComponentProps<'div'> &
  ConditionBuilderContextType;

export function ConditionBuilderRoot(props: ConditionBuilderRoot.Props) {
  const {
    action,
    field,
    operator,
    value,
    onActionChange,
    onFieldChange,
    onOperatorChange,
    onValueChange,
    onClear,
    operatorNeedsValue,
    ...rest
  } = props;

  const contextValue: ConditionBuilderContextType = React.useMemo(
    () => ({
      action,
      field,
      operator,
      value,
      onActionChange,
      onFieldChange,
      onOperatorChange,
      onValueChange,
      onClear,
      operatorNeedsValue,
    }),
    [
      action,
      field,
      operator,
      value,
      onActionChange,
      onFieldChange,
      onOperatorChange,
      onValueChange,
      onClear,
      operatorNeedsValue,
    ]
  );

  return (
    <ConditionBuilderContext.Provider value={contextValue}>
      <div {...rest} />
    </ConditionBuilderContext.Provider>
  );
}

export namespace ConditionBuilderRoot {
  export type Props = ConditionBuilderRootProps;
}
