import { cn } from '~/utils/classname';

import type { Side } from '../interface/multi-unit-field';

type SideIconProps = React.SVGProps<SVGSVGElement> & {
  side?: Side | 'mixed';
};

export function SideIcon(props: SideIconProps) {
  const { side = 'mixed', ...rest } = props;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path
        d="M7 3H17"
        className={cn(
          side === 'top' || side === 'mixed'
            ? 'mly:stroke-current'
            : 'mly:opacity-30'
        )}
      />
      <path
        d="M21 7V17"
        className={cn(
          side === 'right' || side === 'mixed'
            ? 'mly:stroke-current'
            : 'mly:opacity-30'
        )}
      />
      <path
        d="M17 21H7"
        className={cn(
          side === 'bottom' || side === 'mixed'
            ? 'mly:stroke-current'
            : 'mly:opacity-30'
        )}
      />
      <path
        d="M3 7V17"
        className={cn(
          side === 'left' || side === 'mixed'
            ? 'mly:stroke-current'
            : 'mly:opacity-30'
        )}
      />
    </svg>
  );
}
