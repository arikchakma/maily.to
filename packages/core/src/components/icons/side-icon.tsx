import type { BoxSide } from '@maily-to/shared';
import type { SVGProps } from 'react';

export type SideIconProps = SVGProps<SVGSVGElement> & {
  side?: BoxSide | 'mixed';
};

export function SideIcon(props: SideIconProps) {
  const { side = 'mixed', ...rest } = props;

  const isLit = (edge: BoxSide) =>
    side === edge || side === 'mixed' ? '' : undefined;

  return (
    <svg
      data-mly-side-icon=""
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M7 3H17" data-lit={isLit('top')} />
      <path d="M21 7V17" data-lit={isLit('right')} />
      <path d="M17 21H7" data-lit={isLit('bottom')} />
      <path d="M3 7V17" data-lit={isLit('left')} />
    </svg>
  );
}
