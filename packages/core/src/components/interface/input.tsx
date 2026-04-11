import React from 'react';

import { cn } from '~/utils/classname';
import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '~/utils/constants';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, type, ...rest } = props;

  return (
    <input
      {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
      type={type}
      className={cn(
        'mly:flex mly:h-7 mly:w-34 mly:rounded-md mly:border-none mly:bg-soft-gray mly:px-2 mly:text-sm mly:ring-offset-white mly:placeholder:text-gray-500 mly:focus-visible:ring-1 mly:focus-visible:ring-gray-300 mly:focus-visible:ring-offset-0 mly:focus-visible:outline-hidden mly:disabled:cursor-not-allowed mly:disabled:opacity-50',
        'mly-editor',
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});
Input.displayName = 'Input';

type InputLabelProps = React.HTMLAttributes<HTMLSpanElement>;

const InputLabel = React.forwardRef<HTMLSpanElement, InputLabelProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <span
        ref={ref}
        className={cn('mly:text-sm mly:text-gray-500', className)}
        {...rest}
      />
    );
  }
);
InputLabel.displayName = 'InputLabel';

type InputIconProps = React.HTMLAttributes<HTMLSpanElement>;

const InputIcon = React.forwardRef<HTMLSpanElement, InputIconProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;

    return (
      <span
        ref={ref}
        className={cn(
          'mly:absolute mly:inset-y-0 mly:right-2 mly:flex mly:items-center',
          className
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

InputIcon.displayName = 'InputIcon';

type InputWrapperProps = React.HTMLAttributes<HTMLDivElement>;

const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;

    return (
      <div ref={ref} className={cn('mly:relative', className)} {...rest}>
        {children}
      </div>
    );
  }
);
InputWrapper.displayName = 'InputWrapper';

export { Input, InputIcon, InputLabel };
