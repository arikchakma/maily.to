import type * as React from 'react';

import { useSettingsFieldContext } from './settings-field-context';

export type SettingsFieldLabelProps = React.ComponentProps<'label'>;

export function SettingsFieldLabel(props: SettingsFieldLabel.Props) {
  const { id } = useSettingsFieldContext();

  return <label htmlFor={id} {...props} />;
}

export namespace SettingsFieldLabel {
  export type Props = SettingsFieldLabelProps;
}
