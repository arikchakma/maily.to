import * as React from 'react';

import { MAILY_UI_NAMESPACE } from '~/utils/constants';

export type SettingsFieldContext = {
  id: string;
};

export const SettingsFieldContext =
  React.createContext<SettingsFieldContext | null>(null);

export function useSettingsFieldContext() {
  const context = React.useContext(SettingsFieldContext);
  if (!context) {
    throw new Error(
      `${MAILY_UI_NAMESPACE}: SettingsFieldContext is missing. SettingsField parts must be placed within <SettingsField.Root>.`
    );
  }

  return context;
}
