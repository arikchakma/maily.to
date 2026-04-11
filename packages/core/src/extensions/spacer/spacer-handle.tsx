import { cn } from '~/utils/classname';

export type SpacerHandleType = 'top' | 'bottom';

type SpacerHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  handle: SpacerHandleType;
};

export function SpacerHandle(props: SpacerHandleProps) {
  const { className, handle, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        'mly:absolute mly:left-1/2 mly:z-10 mly:h-2 mly:w-10 mly:max-w-1/2 mly:-translate-x-1/2 mly:cursor-row-resize mly:rounded-md mly:border mly:border-gray-200 mly:bg-white',
        handle === 'top' && 'mly:top-1',
        handle === 'bottom' && 'mly:bottom-1',
        className
      )}
    />
  );
}
