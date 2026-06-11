import { mergeProps } from '@base-ui/react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '~/utils/classname';
import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '~/utils/constants';

type FieldRootProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
};

function FieldRoot(props: FieldRootProps) {
  const { className, ref, ...rest } = props;

  return <div ref={ref} className={cn('mly:relative', className)} {...rest} />;
}

type FieldLabelProps = useRender.ComponentProps<'label'>;

function FieldLabel(props: FieldLabelProps) {
  const { className, render, ...rest } = props;

  const element = useRender({
    defaultTagName: 'label',
    render,
    props: mergeProps<'label'>(
      { className: cn('mly:text-sm mly:text-gray-500', className) },
      rest
    ),
  });

  return element;
}

type FieldInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.RefObject<HTMLInputElement | null>;
};

function FieldInput(props: FieldInputProps) {
  const { className, ref, ...rest } = props;

  return (
    <input
      ref={ref}
      {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
      className={cn(
        'mly-editor',
        'mly:flex mly:h-7 mly:w-34 mly:rounded-lg mly:border-none mly:bg-soft-gray mly:px-2 mly:text-sm mly:ring-offset-white mly:placeholder:text-gray-500 mly:focus-visible:ring-1 mly:focus-visible:ring-gray-300 mly:focus-visible:ring-offset-0 mly:focus-visible:outline-hidden mly:disabled:cursor-not-allowed mly:disabled:opacity-50',
        className
      )}
      {...rest}
    />
  );
}

type FieldIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.RefObject<HTMLSpanElement | null>;
};

function FieldIcon(props: FieldIconProps) {
  const { className, children, ...rest } = props;

  return (
    <span
      className={cn(
        'mly:absolute mly:inset-y-0 mly:right-2 mly:flex mly:items-center mly:[&>svg]:size-3.5 mly:[&>svg]:text-gray-500',
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export { FieldIcon, FieldInput, FieldLabel, FieldRoot };
