import type { AllowedVisibilityOperator, AnyMailyNode } from '@maily-to/shared';
import { VISIBILITY_ACTIONS, VISIBILITY_OPERATORS } from '@maily-to/shared';
import type { VisibilityRule } from '@maily-to/shared';

import type { RenderContext } from '../context';
import { getVariableId, getVariableValue } from './resolve-variable';

type OperatorMatchOptions = {
  operator: AllowedVisibilityOperator;
  resolved: unknown;
  value: string;
};

function getOperatorMatch(options: OperatorMatchOptions): boolean {
  const { operator, resolved, value } = options;

  switch (operator) {
    case VISIBILITY_OPERATORS.IS_TRUE:
      return Boolean(resolved);
    case VISIBILITY_OPERATORS.IS_FALSE:
      return !resolved;
    case VISIBILITY_OPERATORS.EQUALS:
      return String(resolved) === value;
    case VISIBILITY_OPERATORS.NOT_EQUALS:
      return String(resolved) !== value;
    case VISIBILITY_OPERATORS.CONTAINS:
      return String(resolved).includes(value);
    case VISIBILITY_OPERATORS.NOT_CONTAINS:
      return !String(resolved).includes(value);
    case VISIBILITY_OPERATORS.STARTS_WITH:
      return String(resolved).startsWith(value);
    case VISIBILITY_OPERATORS.ENDS_WITH:
      return String(resolved).endsWith(value);
    case VISIBILITY_OPERATORS.GREATER_THAN:
      return Number(resolved) > Number(value);
    case VISIBILITY_OPERATORS.LESS_THAN:
      return Number(resolved) < Number(value);
    default:
      return false;
  }
}

type VisibilityMatchOptions = {
  ctx: RenderContext;
  rule: VisibilityRule;
};

function getVisibilityMatch(options: VisibilityMatchOptions): boolean {
  const { ctx, rule } = options;
  const id = getVariableId(rule.variable);

  return getOperatorMatch({
    operator: rule.operator,
    resolved: id ? getVariableValue({ ctx, id }) : undefined,
    value: rule.value,
  });
}

type ShouldShowNodeOptions = {
  ctx: RenderContext;
  node: AnyMailyNode;
};

export function shouldShowNode(options: ShouldShowNodeOptions): boolean {
  const { ctx, node } = options;
  const rule = node.attrs?.visibilityRule as VisibilityRule | null | undefined;

  if (!rule) {
    return true;
  }

  const matched = getVisibilityMatch({ ctx, rule });

  return rule.action === VISIBILITY_ACTIONS.SHOW ? matched : !matched;
}
