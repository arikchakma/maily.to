'use client';

import { BlockItem } from '@/blocks/types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';
import { Editor } from '@tiptap/core';
import { Node as TNode } from '@tiptap/pm/model';

export type Variable = {
  name: string;
  // Default is true
  required?: boolean;
};

export type VariableFunctionOptions = {
  query: string;
  from: 'variable' | 'for';
  editor: Editor;
};

export type VariablesFunction = (
  opts: VariableFunctionOptions
) => Array<Variable>;

export type Variables = Array<Variable> | VariablesFunction;

export const DEFAULT_VARIABLE_TRIGGER_CHAR = '@';
export const DEFAULT_VARIABLES: Variables = [];

export type MailyContextType = {
  variableTriggerCharacter?: string;
  variables?: Variables;
  blocks?: BlockItem[];
};

export const MailyContext = createContext<MailyContextType>({
  variableTriggerCharacter: DEFAULT_VARIABLE_TRIGGER_CHAR,
  variables: DEFAULT_VARIABLES,
  blocks: DEFAULT_SLASH_COMMANDS,
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
