/**
 * Comparison operators for conditional visibility rules.
 * Used to evaluate a template variable against a value
 * to decide whether a node should be shown or hidden.
 */
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

export const VISIBILITY_OPERATOR_OPTIONS: {
  value: AllowedVisibilityOperator;
  label: string;
}[] = [
  { value: VISIBILITY_OPERATORS.IS_TRUE, label: 'Is true' },
  { value: VISIBILITY_OPERATORS.IS_FALSE, label: 'Is false' },
  { value: VISIBILITY_OPERATORS.EQUALS, label: 'Equals' },
  { value: VISIBILITY_OPERATORS.NOT_EQUALS, label: 'Not equals' },
  { value: VISIBILITY_OPERATORS.CONTAINS, label: 'Contains' },
  { value: VISIBILITY_OPERATORS.NOT_CONTAINS, label: 'Not contains' },
  { value: VISIBILITY_OPERATORS.STARTS_WITH, label: 'Starts with' },
  { value: VISIBILITY_OPERATORS.ENDS_WITH, label: 'Ends with' },
  { value: VISIBILITY_OPERATORS.GREATER_THAN, label: 'Greater than' },
  { value: VISIBILITY_OPERATORS.LESS_THAN, label: 'Less than' },
];

/**
 * Unary operators that don't require a comparison value.
 * The UI hides the value input field when one of these is selected.
 */
export const OPERATORS_WITHOUT_VALUE: AllowedVisibilityOperator[] = [
  VISIBILITY_OPERATORS.IS_TRUE,
  VISIBILITY_OPERATORS.IS_FALSE,
];

export const VISIBILITY_ACTIONS = {
  NONE: 'none',
  SHOW: 'show',
  HIDE: 'hide',
} as const;

export type AllowedVisibilityAction =
  (typeof VISIBILITY_ACTIONS)[keyof typeof VISIBILITY_ACTIONS];

export const VISIBILITY_ACTION_OPTIONS: {
  value: AllowedVisibilityAction;
  label: string;
}[] = [
  { value: VISIBILITY_ACTIONS.NONE, label: 'None' },
  { value: VISIBILITY_ACTIONS.SHOW, label: 'Show if' },
  { value: VISIBILITY_ACTIONS.HIDE, label: 'Hide if' },
];

/**
 * Defines when a node is conditionally shown or hidden based on
 * a template variable. Evaluated at render time by the renderer.
 */
export type VisibilityRule = {
  action: AllowedVisibilityAction;
  variable: string;
  operator: AllowedVisibilityOperator;
  value: string;
};

/** Mixin for nodes that support conditional visibility. */
export type WithVisibilityAttrs = {
  visibilityRule?: VisibilityRule | null;
};
