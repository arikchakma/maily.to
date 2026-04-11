import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from '@tiptap/suggestion';
import React, { useImperativeHandle, useRef } from 'react';

import type { Variable } from '~/utils/variable';

import type { VariableSuggestionsPopoverRef } from './variable-suggestions-popover';
import { VariableSuggestionsPopover } from './variable-suggestions-popover';

type VariableSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

type VariableSuggestionListProps = SuggestionProps<Variable>;

export const VariableSuggestionList = React.forwardRef<
  VariableSuggestionListRef,
  VariableSuggestionListProps
>((props, ref) => {
  const { items, command: selectItem } = props;

  const popoverRef = useRef<VariableSuggestionsPopoverRef>(null);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!popoverRef.current) {
        return false;
      }

      return popoverRef.current.onKeyDown(event);
    },
  }));

  return (
    <VariableSuggestionsPopover
      items={items}
      onSelectItem={(value) => {
        selectItem({
          id: value.id ?? value.name,
          required: value.required ?? true,
          hideDefaultValue: value?.hideDefaultValue ?? false,
          label: value?.label,
        });
      }}
      ref={popoverRef}
    />
  );
});

VariableSuggestionList.displayName = 'VariableSuggestionList';
