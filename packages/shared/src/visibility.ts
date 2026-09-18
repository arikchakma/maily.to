export const VISIBILITY_ACTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
} as const;

export type AllowedVisibilityAction =
  (typeof VISIBILITY_ACTIONS)[keyof typeof VISIBILITY_ACTIONS];

const allowedVisibilityActions = Object.values(VISIBILITY_ACTIONS);

export const VISIBILITY_ACTION_OPTIONS: {
  label: string;
  value: AllowedVisibilityAction;
}[] = [
  { label: 'Show if', value: VISIBILITY_ACTIONS.SHOW },
  { label: 'Hide if', value: VISIBILITY_ACTIONS.HIDE },
];

export const VISIBILITY_OPERATORS = {
  IS_TRUE: 'is_true',
  IS_FALSE: 'is_false',
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
} as const;

export type AllowedVisibilityOperator =
  (typeof VISIBILITY_OPERATORS)[keyof typeof VISIBILITY_OPERATORS];

const allowedVisibilityOperators = Object.values(VISIBILITY_OPERATORS);

export const VISIBILITY_OPERATOR_OPTIONS: {
  label: string;
  value: AllowedVisibilityOperator;
}[] = [
  { label: 'Is true', value: VISIBILITY_OPERATORS.IS_TRUE },
  { label: 'Is false', value: VISIBILITY_OPERATORS.IS_FALSE },
  { label: 'Equals', value: VISIBILITY_OPERATORS.EQUALS },
  { label: 'Not equals', value: VISIBILITY_OPERATORS.NOT_EQUALS },
  { label: 'Contains', value: VISIBILITY_OPERATORS.CONTAINS },
  { label: 'Not contains', value: VISIBILITY_OPERATORS.NOT_CONTAINS },
  { label: 'Starts with', value: VISIBILITY_OPERATORS.STARTS_WITH },
  { label: 'Ends with', value: VISIBILITY_OPERATORS.ENDS_WITH },
  { label: 'Greater than', value: VISIBILITY_OPERATORS.GREATER_THAN },
  { label: 'Less than', value: VISIBILITY_OPERATORS.LESS_THAN },
];

const VISIBILITY_OPERATORS_WITHOUT_VALUE: AllowedVisibilityOperator[] = [
  VISIBILITY_OPERATORS.IS_TRUE,
  VISIBILITY_OPERATORS.IS_FALSE,
];

export type VisibilityRule = {
  action: AllowedVisibilityAction;
  operator: AllowedVisibilityOperator;
  value: string;
  variable: string;
};

export type WithVisibilityAttrs = {
  visibilityRule?: VisibilityRule | null;
};

export const DEFAULT_VISIBILITY_RULE: VisibilityRule = {
  action: VISIBILITY_ACTIONS.SHOW,
  operator: VISIBILITY_OPERATORS.EQUALS,
  value: '',
  variable: '',
};

export function getVisibilityValueSupport(
  operator: AllowedVisibilityOperator
): boolean {
  return !VISIBILITY_OPERATORS_WITHOUT_VALUE.includes(operator);
}

type VisibilityRuleOptions = {
  action: string | null | undefined;
  operator: string | null | undefined;
  value: string | null | undefined;
  variable: string | null | undefined;
};

export function getVisibilityRule(
  options: VisibilityRuleOptions
): VisibilityRule | null {
  const { action, operator, value, variable } = options;

  const isAllowedAction = allowedVisibilityActions.some((candidate) => {
    return candidate === action;
  });
  const isAllowedOperator = allowedVisibilityOperators.some((candidate) => {
    return candidate === operator;
  });

  if (!(isAllowedAction && isAllowedOperator)) {
    return null;
  }

  return {
    action: action as AllowedVisibilityAction,
    operator: operator as AllowedVisibilityOperator,
    value: getVisibilityValueSupport(operator as AllowedVisibilityOperator)
      ? (value ?? '')
      : '',
    variable: variable ?? '',
  };
}
