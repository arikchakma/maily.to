import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import type { Editor } from '@tiptap/react';

/** A variable item passed to the editor's variable suggestion list. */
export type Variable = Omit<VariableNodeAttrs, 'variableSuggestionChar'> & {
  /** @deprecated Use `id` instead. Will be removed in a future version. */
  name?: string;
  /** Arbitrary metadata attached to this variable (e.g. category, type). */
  metadata?: Record<string, unknown>;
};

export type VariableFunctionOptions = {
  query: string;
  editor: Editor;
};

export type VariablesFunction = (
  opts: VariableFunctionOptions
) => Array<Variable>;

export type Variables = Array<Variable> | VariablesFunction;

export const VARIABLE_SUGGESTION_POPOVER_ID = 'mly-variable-suggestion-popover';

function getVariableLabel(item: Variable): string {
  return item.label ?? item.id ?? item.name ?? '';
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
      hideDefaultValue: false,
    });
  }

  return filtered;
}
