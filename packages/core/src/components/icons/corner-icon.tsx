import type { BoxCorner } from '@maily-to/shared';
import type { SVGProps } from 'react';

export type CornerIconProps = SVGProps<SVGSVGElement> & {
  corner?: BoxCorner | 'mixed';
};

export function CornerIcon(props: CornerIconProps) {
  const { corner = 'mixed', ...rest } = props;

  const isLit = (edge: BoxCorner) =>
    corner === edge || corner === 'mixed' ? '' : undefined;

  return (
    <svg
      data-mly-corner-icon=""
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
      <path d="M3 7V5a2 2 0 0 1 2-2h2" data-lit={isLit('topLeft')} />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" data-lit={isLit('topRight')} />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" data-lit={isLit('bottomRight')} />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" data-lit={isLit('bottomLeft')} />
    </svg>
  );
}
