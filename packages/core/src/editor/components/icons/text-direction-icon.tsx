import { SVGProps } from 'react';

export function LtrIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 5h6" />
      <path d="M11 5v14" />
      <path d="M15 5v14" />
      <path d="M6 18l-3-3 3-3" />
      <path d="M3 15h5" />
    </svg>
  );
}

export function RtlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 5h6" />
      <path d="M10 5v14" />
      <path d="M14 5v14" />
      <path d="M18 18l3-3-3-3" />
      <path d="M16 15h5" />
    </svg>
  );
}
