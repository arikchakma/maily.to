import { cn } from '~/utils/classname';

type ToolbarGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export function ToolbarGroup(props: ToolbarGroup.Props) {
  const { children, className } = props;

  return (
    <div
      className={cn(
        'mly:flex mly:items-stretch mly:gap-0.5 mly:rounded-xl mly:border mly:border-gray-200/70 mly:bg-white mly:p-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

export namespace ToolbarGroup {
  export type Props = ToolbarGroupProps;
}
