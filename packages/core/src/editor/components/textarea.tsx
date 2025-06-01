import * as React from 'react';

import { cn } from '../utils/classname';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'mly:flex mly:min-h-24 mly:w-full mly:rounded-md mly:border mly:border-gray-200 mly:bg-white mly:px-3 mly:py-2 mly:text-sm mly:ring-offset-white mly:file:border-0 mly:file:bg-transparent mly:file:text-sm mly:file:font-medium mly:placeholder:text-gray-500 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-gray-400 mly:focus-visible:ring-offset-2 mly:disabled:cursor-not-allowed mly:disabled:opacity-50',
          'mly-editor',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
