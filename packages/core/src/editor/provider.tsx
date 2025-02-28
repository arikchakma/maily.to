'use client';

import { BlockGroupItem } from '@/blocks/types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';
import { Editor } from '@tiptap/core';
import { DefaultRenderVariable } from './nodes/variable/variable-view';
import {
  VariableSuggestionsPopover,
  type VariableSuggestionsPopoverType,
} from './nodes/variable/variable-suggestions-popover';

export type Variable = {
  name: string;
  // Default is true
  required?: boolean;
  // default is true
  valid?: boolean;
};

export type VariableFunctionOptions = {
  query: string;
  from: 'content-variable' | 'bubble-variable' | 'repeat-variable';
  editor: Editor;
};

export type VariablesFunction = (
  opts: VariableFunctionOptions
) => Array<Variable>;

export type Variables = Array<Variable> | VariablesFunction;

export type RenderVariableOptions = {
  variable: Variable;
  fallback?: string;
  editor: Editor;
  from: 'content-variable' | 'bubble-variable' | 'button-variable';
};

export type RenderVariableFunction = (
  opts: RenderVariableOptions
) => JSX.Element | null;

export const DEFAULT_PLACEHOLDER_URL = 'maily.to/';

export const DEFAULT_VARIABLE_TRIGGER_CHAR = '@';
export const DEFAULT_VARIABLES: Variables = [];
export const DEFAULT_RENDER_VARIABLE_FUNCTION: RenderVariableFunction =
  DefaultRenderVariable;
export const DEFAULT_VARIABLE_SUGGESTION_POPOVER = VariableSuggestionsPopover;

export type MailyContextType = {
  placeholderUrl?: string;
  variableTriggerCharacter?: string;
  variables?: Variables;
  blocks?: BlockGroupItem[];
  renderVariable?: RenderVariableFunction;

  /**
   * Variable suggestion popover is the component that will be used to render
   * the variable suggestions for the content, bubble menu variables
   * @default VariableSuggestionPopover
   */
  variableSuggestionPopover?: VariableSuggestionsPopoverType;
};

export const MailyContext = createContext<MailyContextType>({
  placeholderUrl: DEFAULT_PLACEHOLDER_URL,
  variableTriggerCharacter: DEFAULT_VARIABLE_TRIGGER_CHAR,
  variables: DEFAULT_VARIABLES,
  blocks: DEFAULT_SLASH_COMMANDS,
  renderVariable: DEFAULT_RENDER_VARIABLE_FUNCTION,
  variableSuggestionPopover: DEFAULT_VARIABLE_SUGGESTION_POPOVER,
});

type MailyProviderProps = PropsWithChildren<MailyContextType>;

export function MailyProvider(props: MailyProviderProps) {
  const { children, ...defaultValues } = props;

  if (defaultValues.variableTriggerCharacter === '') {
    throw new Error('variableTriggerCharacter cannot be an empty string');
  }

  return (
    <MailyContext.Provider value={defaultValues}>
      {children}
    </MailyContext.Provider>
  );
}

export function useMailyContext() {
  const values = useContext(MailyContext);
  if (!values) {
    throw new Error('Missing MailyContext.Provider in the component tree');
  }

  return values;
}
