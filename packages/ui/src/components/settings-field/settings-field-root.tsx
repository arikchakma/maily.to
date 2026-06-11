import * as React from 'react';

import { useMailyId } from '../../hooks/use-maily-id';
import { SettingsFieldContext } from './settings-field-context';

export type SettingsFieldRootProps = React.ComponentProps<'div'>;

export function SettingsFieldRoot(props: SettingsFieldRoot.Props) {
  const id = useMailyId();

  return (
    <SettingsFieldContext value={{ id }}>
      <div {...props} />
    </SettingsFieldContext>
  );
}

export namespace SettingsFieldRoot {
  export type Props = SettingsFieldRootProps;
}
