'use client';

import { BlockItem } from '@/blocks/types';
import { createContext, PropsWithChildren, useContext } from 'react';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';

export type Variables = Array<{
  name: string;
  // Default is true
  required?: boolean;

  // Default is false
  iterable?: boolean;
  keys?: Array<string>;
}>;

export const DEFAULT_TRIGGER_SUGGESTION_CHAR = '@';

export type MailyContextType = {
  triggerSuggestionCharacter?: string;
  variables?: Variables;
  blocks?: BlockItem[];
};

export const MailyContext = createContext<MailyContextType>({
  triggerSuggestionCharacter: DEFAULT_TRIGGER_SUGGESTION_CHAR,
  variables: [],
  blocks: DEFAULT_SLASH_COMMANDS,
});

type MailyProviderProps = PropsWithChildren<MailyContextType>;

export function MailyProvider(props: MailyProviderProps) {
  const { children, ...defaultValues } = props;

  if (defaultValues.triggerSuggestionCharacter === '') {
    throw new Error('triggerSuggestionCharacter cannot be an empty string');
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
