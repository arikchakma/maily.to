import { cn } from '@/editor/utils/classname';

type Props = {
  type?: 'horizontal' | 'vertical';
  className?: string;
};

export function Divider(props: Props) {
  const { type = 'vertical', className } = props;

  return (
    <div
      className={cn(
        'mly-mx-0.5 mly-bg-gray-200',
        type === 'vertical' ? 'mly-w-px' : 'mly-h-px',
        className
      )}
    />
  );
}
