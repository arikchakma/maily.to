import { useId } from 'react';

export function useMailyId() {
  return `mly:${useId()}`;
}
