import * as React from 'react';

import { MAILY_UI_NAMESPACE } from '~/utils/constants';

export type ConditionBuilderContext = {
  action: string;
  field: string;
  operator: string;
  value: string;
  onActionChange: (action: string) => void;
  onFieldChange: (field: string) => void;
  onOperatorChange: (operator: string) => void;
  onValueChange: (value: string) => void;
  onClear: () => void;
  operatorNeedsValue: boolean;
};

export const ConditionBuilderContext =
  React.createContext<ConditionBuilderContext | null>(null);

export function useConditionBuilderContext() {
  const context = React.useContext(ConditionBuilderContext);
  if (!context) {
    throw new Error(
      `${MAILY_UI_NAMESPACE}: ConditionBuilderContext is missing. ConditionBuilder parts must be placed within <ConditionBuilder.Root>.`
    );
  }

  return context;
}
