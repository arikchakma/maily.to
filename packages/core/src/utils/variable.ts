import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import type { Editor } from '@tiptap/react';

/** A variable item passed to the editor's variable suggestion list. */
export type Variable = Omit<VariableNodeAttrs, 'variableSuggestionChar'> & {
  /** Arbitrary metadata attached to this variable (e.g. category, type). */
  metadata?: Record<string, unknown>;
};

export type VariableFunctionOptions = {
  editor: Editor;
  query: string;
};

export type VariablesFunction = (
  opts: VariableFunctionOptions
) => Array<Variable>;

export type Variables = Array<Variable> | VariablesFunction;

export const VARIABLE_SUGGESTION_POPOVER_ID = 'mly-variable-suggestion-popover';

function getVariableLabel(item: Variable): string {
  return item.label ?? item.id ?? '';
}

/**
 * Filters the variable list by query prefix. If no exact match exists,
 * appends a dynamic entry so users can create variables on the fly.
 */
export function filterVariableSuggestions(
  variables: Variables = [],
  opts: VariableFunctionOptions
): Array<Variable> {
  if (typeof variables === 'function') {
    return variables(opts);
  }

  const query = opts.query.toLowerCase();
  const filtered = variables.filter((item) =>
    getVariableLabel(item).toLowerCase().startsWith(query)
  );

  const hasExactMatch = variables.some(
    (item) => getVariableLabel(item).toLowerCase() === query
  );
  if (!hasExactMatch && query.length > 0) {
    filtered.push({
      id: opts.query,
      label: opts.query,
      required: true,
      isDefaultEditable: true,
    });
  }

  return filtered;
}
