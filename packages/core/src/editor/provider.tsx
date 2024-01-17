'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

export type Variables = Array<{
  name: string;
  // Default is true
  required?: boolean;
}>;

type MailyContextType = {
  variables?: Variables;
};

export const MailyContext = createContext<MailyContextType>({
  variables: [],
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
