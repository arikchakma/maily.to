import type { ComponentPropsWithRef } from 'react';

export type ButtonProps = ComponentPropsWithRef<'button'>;

export function Button(props: ButtonProps) {
  const { disabled, type = 'button', ...rest } = props;

  return (
    <button
      {...rest}
      data-disabled={disabled ? '' : undefined}
      data-mly-button=""
      disabled={disabled}
      type={type}
    />
  );
}
