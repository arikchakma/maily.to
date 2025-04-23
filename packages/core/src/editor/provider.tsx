'use client';

import { BlockGroupItem } from '@/blocks/types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';
<<<<<<< HEAD
import { DefaultRenderVariable } from './nodes/variable/variable-view';
import { MailyEditor } from '.';

export type Variable = {
  name: string;
  // Default is true
  required?: boolean;
  // default is true
  valid?: boolean;
};

export type VariableFunctionOptions = {
  query: string;
  from: 'content-variable' | 'bubble-variable' | 'for-variable';
  editor: MailyEditor;
};

export type VariablesFunction = (
  opts: VariableFunctionOptions
) => Array<Variable>;

export type Variables = Array<Variable> | VariablesFunction;

export type RenderVariableOptions = {
  variable: Variable;
  fallback?: string;
  editor: MailyEditor;
  from: 'content-variable' | 'bubble-variable' | 'button-variable';
};

export type RenderVariableFunction = (
  opts: RenderVariableOptions
) => JSX.Element | null;

export const DEFAULT_VARIABLE_TRIGGER_CHAR = '@';
export const DEFAULT_VARIABLES: Variables = [];
export const DEFAULT_RENDER_VARIABLE_FUNCTION: RenderVariableFunction =
  DefaultRenderVariable;
=======

export const DEFAULT_PLACEHOLDER_URL = 'https://maily.to/';
>>>>>>> main

export type MailyContextType = {
  placeholderUrl?: string;
  blocks?: BlockGroupItem[];
};

export const MailyContext = createContext<MailyContextType>({
  placeholderUrl: DEFAULT_PLACEHOLDER_URL,
  blocks: DEFAULT_SLASH_COMMANDS,
});

type MailyProviderProps = PropsWithChildren<MailyContextType>;

export function MailyProvider(props: MailyProviderProps) {
  const { children, ...defaultValues } = props;

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
