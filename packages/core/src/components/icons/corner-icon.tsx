import { cn } from '~/utils/classname';

import type { Corner } from '../interface/multi-unit-field';

type CornerIconProps = React.SVGProps<SVGSVGElement> & {
  corner: Corner;
};

export function CornerIcon(props: CornerIconProps) {
  const { corner, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path
        d="M3 7V5a2 2 0 0 1 2-2h2"
        className={cn(
          corner === 'topLeft' ? 'mly:stroke-current' : 'mly:opacity-30'
        )}
      />
      <path
        d="M17 3h2a2 2 0 0 1 2 2v2"
        className={cn(
          corner === 'topRight' ? 'mly:stroke-current' : 'mly:opacity-30'
        )}
      />
      <path
        d="M21 17v2a2 2 0 0 1-2 2h-2"
        className={cn(
          corner === 'bottomRight' ? 'mly:stroke-current' : 'mly:opacity-30'
        )}
      />
      <path
        d="M7 21H5a2 2 0 0 1-2-2v-2"
        className={cn(
          corner === 'bottomLeft' ? 'mly:stroke-current' : 'mly:opacity-30'
        )}
      />
    </svg>
  );
}
