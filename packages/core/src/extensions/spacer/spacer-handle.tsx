import type { ComponentPropsWithRef } from 'react';

export type SpacerHandleType = 'bottom' | 'top';

export type SpacerHandleProps = ComponentPropsWithRef<'div'> & {
  handle: SpacerHandleType;
};

export function SpacerHandle(props: SpacerHandleProps) {
  const { handle, ...rest } = props;

  return <div {...rest} data-mly-spacer-handle="" data-side={handle} />;
}
