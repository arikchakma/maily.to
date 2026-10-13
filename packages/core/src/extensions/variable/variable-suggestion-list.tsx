import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from '@tiptap/suggestion';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { Variable } from '~/utils/variable';

import type { VariableSuggestionsPopoverRef } from './variable-suggestions-popover';
import { VariableSuggestionsPopover } from './variable-suggestions-popover';

export type VariableSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type VariableSuggestionListProps = SuggestionProps<Variable>;

export const VariableSuggestionList = forwardRef<
  VariableSuggestionListRef,
  VariableSuggestionListProps
>((props, ref) => {
  const { command: selectItem, items } = props;

  const popoverRef = useRef<VariableSuggestionsPopoverRef>(null);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => popoverRef.current?.onKeyDown(event) ?? false,
  }));

  return (
    <VariableSuggestionsPopover
      items={items}
      onSelectItem={(value) => {
        selectItem({
          id: value.id,
          isDefaultEditable:
            value.isDefaultEditable ?? value.hideDefaultValue !== true,
          label: value.label,
          required: value.required ?? true,
        });
      }}
      ref={popoverRef}
    />
  );
});

VariableSuggestionList.displayName = 'VariableSuggestionList';
