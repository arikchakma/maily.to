import type * as React from 'react';

export type SettingsFieldGroupProps = React.ComponentProps<'div'>;

export function SettingsFieldGroup(props: SettingsFieldGroup.Props) {
  return <div role="group" {...props} />;
}

export namespace SettingsFieldGroup {
  export type Props = SettingsFieldGroupProps;
}
