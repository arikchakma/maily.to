import * as React from 'react';

import { useMergeRefs } from '~/hooks/use-merge-refs';

import { ThemeSettingsContext } from './theme-settings-context';

export type ThemeSettingsRootProps = React.ComponentProps<'div'>;

export function ThemeSettingsRoot(props: ThemeSettingsRoot.Props) {
  const { ref, ...rest } = props;

  const internalRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs([ref, internalRef]);

  return (
    <ThemeSettingsContext value={{ container: internalRef }}>
      <div ref={mergedRef} {...rest} />
    </ThemeSettingsContext>
  );
}

export namespace ThemeSettingsRoot {
  export type Props = ThemeSettingsRootProps;
}
