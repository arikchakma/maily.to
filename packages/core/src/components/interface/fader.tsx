import type { CSSProperties } from 'react';

import { cn } from '~/utils/classname';

type FaderProps = {
  stop?: string;
  blur?: string;
  height?: number;
  side: 'top' | 'bottom' | 'left' | 'right';
  backgroundColor?: string;
  className?: string;
  style?: CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
};

export function Fader(props: FaderProps) {
  const {
    stop = '25%',
    blur = '1px',
    height = 48,
    side,
    backgroundColor = 'var(--mly-color-white)',
    className,
    style,
    ref,
  } = props;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'mly-scroll-fader mly:user-select-none mly:pointer-events-none mly:absolute mly:left-0 mly:h-(--height) mly:w-full mly:bg-(--color-bg) mly:backdrop-blur-(--blur)',
        'mly:data-[side=top]:top-0 mly:data-[side=top]:mask-[linear-gradient(to_bottom,var(--color-bg)_var(--stop),transparent)] mly:data-[side=top]:[background:linear-gradient(to_bottom,var(--color-bg),transparent)]',
        'mly:data-[side=bottom]:bottom-0 mly:data-[side=bottom]:mask-[linear-gradient(to_top,var(--color-bg)_var(--stop),transparent)] mly:data-[side=bottom]:[background:linear-gradient(to_top,var(--color-bg),transparent)]',
        className
      )}
      data-side={side}
      style={{
        '--stop': stop,
        '--blur': blur,
        '--height': `${height}px`,
        '--color-bg': backgroundColor,
        ...style,
      }}
    />
  );
}
