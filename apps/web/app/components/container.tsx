import { cn } from '~/lib/classname';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container(props: ContainerProps) {
  const { children, className } = props;

  return (
    <div className={cn('mx-auto max-w-[600px] px-2', className)}>
      {children}
    </div>
  );
}
