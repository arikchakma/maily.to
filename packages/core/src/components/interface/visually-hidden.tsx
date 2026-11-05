import type { ComponentPropsWithRef } from 'react';

export type VisuallyHiddenProps = ComponentPropsWithRef<'span'>;

export function VisuallyHidden(props: VisuallyHiddenProps) {
  const { style, ...rest } = props;

  return (
    <span
      data-mly-visually-hidden=""
      {...rest}
      style={{
        border: 0,
        clipPath: 'inset(50%)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: 1,
        ...style,
      }}
    />
  );
}
