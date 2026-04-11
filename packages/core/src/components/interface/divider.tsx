import { cn } from '~/utils/classname';

type DividerProps = {
  type?: 'horizontal' | 'vertical';
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

export function Divider(props: DividerProps) {
  const { type = 'vertical', className, ref } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'mly-divider mly:shrink-0 mly:bg-gray-200/70',
        type === 'vertical' ? 'mly:w-px' : 'mly:h-px',
        className
      )}
    />
  );
}
