import { cn } from '~/utils/classname';

export type ResizableImageHandleType = 'left' | 'right';

type ResizableImageHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  handle: ResizableImageHandleType;
};

export function ResizableImageHandle(props: ResizableImageHandleProps) {
  const { className, handle, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        'mly:absolute mly:top-1/2 mly:z-10 mly:h-10 mly:max-h-1/2 mly:w-2 mly:-translate-y-1/2 mly:cursor-col-resize mly:rounded-md mly:border mly:border-gray-200 mly:bg-white mly:@max-resizable-image/resizable-image:h-5 mly:@max-resizable-image/resizable-image:w-1.5',
        handle === 'left' &&
          'mly:left-2 mly:@max-resizable-image/resizable-image:left-1',
        handle === 'right' &&
          'mly:right-2 mly:@max-resizable-image/resizable-image:right-1',
        className
      )}
    />
  );
}
