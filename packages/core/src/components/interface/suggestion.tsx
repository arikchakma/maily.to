import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SuggestionWrapperProps = ComponentPropsWithRef<'div'>;

export function SuggestionWrapper(props: SuggestionWrapperProps) {
  return <div {...props} data-mly-suggestion="" />;
}

export type SuggestionHeaderProps = ComponentPropsWithRef<'div'>;

export function SuggestionHeader(props: SuggestionHeaderProps) {
  return <div {...props} data-mly-suggestion-header="" />;
}

export type SuggestionKeyIconProps = {
  children: ReactNode;
};

export function SuggestionKeyIcon(props: SuggestionKeyIconProps) {
  return <div data-mly-suggestion-key="">{props.children}</div>;
}

export function SuggestionFooter() {
  return (
    <div data-mly-suggestion-footer="">
      <div data-mly-suggestion-hint="">
        <SuggestionKeyIcon>
          <ArrowDownIcon size={12} />
        </SuggestionKeyIcon>
        <SuggestionKeyIcon>
          <ArrowUpIcon size={12} />
        </SuggestionKeyIcon>
        <span>Navigate</span>
      </div>
      <SuggestionKeyIcon>
        <CornerDownLeftIcon size={12} />
      </SuggestionKeyIcon>
    </div>
  );
}
