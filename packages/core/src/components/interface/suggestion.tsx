import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '~/utils/classname';

type SuggestionFooterProps = {
  showFaders: boolean;
};

export function SuggestionFooter(props: SuggestionFooterProps) {
  const { showFaders } = props;

  return (
    <div
      className={cn(
        'mly:flex mly:items-center mly:justify-between mly:gap-2 mly:p-1.5 mly:text-gray-500',
        !showFaders && 'mly:tiny-border mly:tiny-border-t'
      )}
    >
      <div className="mly:flex mly:items-center mly:gap-1">
        <SuggestionKeyIcon>
          <ArrowDownIcon className="mly:size-3" />
        </SuggestionKeyIcon>
        <SuggestionKeyIcon>
          <ArrowUpIcon className="mly:size-3" />
        </SuggestionKeyIcon>
        <span className="mly:text-xs mly:text-gray-500">Navigate</span>
      </div>
      <SuggestionKeyIcon>
        <CornerDownLeftIcon className="mly:size-3" />
      </SuggestionKeyIcon>
    </div>
  );
}

type SuggestionKeyIconProps = {
  className?: string;
  children: ReactNode;
};

export function SuggestionKeyIcon(props: SuggestionKeyIconProps) {
  const { className, children } = props;

  return (
    <div
      className={cn(
        'mly:flex mly:size-5 mly:items-center mly:justify-center mly:rounded-lg mly:bubble-container-border mly:border',
        className
      )}
    >
      {children}
    </div>
  );
}

type SuggestionWrapperProps = {
  className?: string;
  children: ReactNode;
};

export function SuggestionWrapper(props: SuggestionWrapperProps) {
  const { className, children } = props;

  return (
    <div
      className={cn(
        'mly:z-50 mly:w-64 mly:cursor-default mly:overflow-hidden mly:rounded-xl mly:bubble-container-border mly:border mly:bg-white mly:shadow-md mly:transition-all mly:outline-none',
        className
      )}
    >
      {children}
    </div>
  );
}
