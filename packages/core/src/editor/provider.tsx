'use client';

import { Editor, Range } from '@tiptap/core';
import { createContext, PropsWithChildren, useContext } from 'react';

export type Variables = Array<{
  name: string;
  // Default is true
  required?: boolean;
}>;

export interface CommandProps {
  editor: Editor;
  range: Range;
}

export type SlashCommandItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: JSX.Element;
  shouldBeHidden?: (editor: Editor) => boolean;
  command: (options: CommandProps) => void;
};

export const DEFAULT_VARIABLE_SUGGESTION_CHAR = '@';
export const DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR = '#';

export type MailyContextType = {
  variableSuggestionChar?: string;
  payloadValueSuggestionChar?: string;
  variables?: Variables;
  slashCommands?: SlashCommandItem[];
};

export const MailyContext = createContext<MailyContextType>({
  variableSuggestionChar: DEFAULT_VARIABLE_SUGGESTION_CHAR,
  payloadValueSuggestionChar: DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR,
  variables: [],
  slashCommands: [],
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
