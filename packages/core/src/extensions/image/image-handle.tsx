import type { ComponentPropsWithRef } from 'react';

export type ImageHandleType = 'left' | 'right';

export type ImageHandleProps = ComponentPropsWithRef<'div'> & {
  handle: ImageHandleType;
};

export function ImageHandle(props: ImageHandleProps) {
  const { handle, ...rest } = props;

  return <div {...rest} data-mly-image-handle="" data-side={handle} />;
}
