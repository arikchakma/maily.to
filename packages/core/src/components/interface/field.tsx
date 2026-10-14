import type { ComponentPropsWithRef } from 'react';

export type FieldRootProps = ComponentPropsWithRef<'div'>;

export function FieldRoot(props: FieldRootProps) {
  return <div data-mly-field="" {...props} />;
}

export type FieldLabelProps = ComponentPropsWithRef<'label'>;

export function FieldLabel(props: FieldLabelProps) {
  return <label data-mly-field-label="" {...props} />;
}

export type FieldControlProps = ComponentPropsWithRef<'div'>;

export function FieldControl(props: FieldControlProps) {
  return <div data-mly-field-control="" {...props} />;
}

export type FieldIconProps = ComponentPropsWithRef<'span'>;

export function FieldIcon(props: FieldIconProps) {
  return <span data-mly-field-icon="" {...props} />;
}

export type FieldInputProps = ComponentPropsWithRef<'input'>;

export function FieldInput(props: FieldInputProps) {
  const { type = 'text', ...rest } = props;

  return (
    <input
      autoComplete="off"
      data-1p-ignore=""
      data-lpignore="true"
      spellCheck={false}
      {...rest}
      data-mly-field-input=""
      type={type}
    />
  );
}
