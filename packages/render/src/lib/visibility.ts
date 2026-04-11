import type { AllowedVisibilityOperator, AnyMailyNode } from '@maily-to/shared';
import { VISIBILITY_ACTIONS, VISIBILITY_OPERATORS } from '@maily-to/shared';

import type { RenderContext } from '../context';

/**
 * Evaluates a node's visibility rule against the current variables.
 * Returns true (visible) when there's no rule, or when the rule
 * matches for "show" / doesn't match for "hide".
 */
export function shouldShow(node: AnyMailyNode, ctx: RenderContext): boolean {
  const rule = node.attrs?.visibilityRule;
  if (!rule || rule.action === VISIBILITY_ACTIONS.NONE) {
    return true;
  }

  const { action, variable, operator, value } = rule;
  const item = ctx.get('item');

  let resolvedValue: unknown;
  if (item && variable in item) {
    resolvedValue = item[variable];
  } else {
    resolvedValue = ctx.config.variableValues.get(variable);
  }

  const matched = evaluate(operator, resolvedValue, value);

  if (action === VISIBILITY_ACTIONS.SHOW) {
    return matched;
  }
  if (action === VISIBILITY_ACTIONS.HIDE) {
    return !matched;
  }

  return true;
}

function evaluate(
  operator: AllowedVisibilityOperator,
  resolvedValue: unknown,
  compareValue: string
): boolean {
  switch (operator) {
    case VISIBILITY_OPERATORS.IS_TRUE:
      return Boolean(resolvedValue);
    case VISIBILITY_OPERATORS.IS_FALSE:
      return !resolvedValue;
    case VISIBILITY_OPERATORS.EQUALS:
      return String(resolvedValue) === compareValue;
    case VISIBILITY_OPERATORS.NOT_EQUALS:
      return String(resolvedValue) !== compareValue;
    case VISIBILITY_OPERATORS.CONTAINS:
      return String(resolvedValue).includes(compareValue);
    case VISIBILITY_OPERATORS.NOT_CONTAINS:
      return !String(resolvedValue).includes(compareValue);
    case VISIBILITY_OPERATORS.STARTS_WITH:
      return String(resolvedValue).startsWith(compareValue);
    case VISIBILITY_OPERATORS.ENDS_WITH:
      return String(resolvedValue).endsWith(compareValue);
    case VISIBILITY_OPERATORS.GREATER_THAN:
      return Number(resolvedValue) > Number(compareValue);
    case VISIBILITY_OPERATORS.LESS_THAN:
      return Number(resolvedValue) < Number(compareValue);
    default:
      return false;
  }
}
