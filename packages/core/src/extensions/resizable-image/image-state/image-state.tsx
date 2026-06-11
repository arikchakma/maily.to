import type { LucideIcon } from 'lucide-react';

import { cn } from '~/utils/classname';

type ImageStateRootProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function ImageStateRoot(props: ImageStateRootProps) {
  const { children, className, ...rest } = props;

  return (
    <div
      className={cn(
        'mly:flex mly:items-center mly:justify-center mly:gap-2 mly:rounded-lg mly:bg-soft-gray mly:px-4 mly:py-3 mly:text-sm mly:font-medium',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

type ImageStateIconProps = {
  icon: LucideIcon;
  className?: string;
};

function ImageStateIcon(props: ImageStateIconProps) {
  const { icon: Icon, className } = props;

  return <Icon className={cn('mly:size-4 mly:stroke-[2.5]', className)} />;
}

type ImageStateLabelProps = {
  children: React.ReactNode;
};

function ImageStateLabel(props: ImageStateLabelProps) {
  return <span className="not-prose">{props.children}</span>;
}

export const ImageState = {
  Root: ImageStateRoot,
  Icon: ImageStateIcon,
  Label: ImageStateLabel,
};
