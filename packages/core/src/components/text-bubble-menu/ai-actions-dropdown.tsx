import type { AIActionsStorage } from '@maily-to/extension-ai-actions';
import { useEditorState } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import {
  CheckIcon,
  CircleAlertIcon,
  Loader2Icon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  TypeIcon,
  WandSparklesIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuTrigger,
  DropdownPositioner,
} from '../interface/dropdown-menu';

type AIActionItem = {
  icon: LucideIcon;
  id: string;
  label: string;
};

const AI_ACTION_ITEMS: AIActionItem[] = [
  { icon: WandSparklesIcon, id: 'improve', label: 'Improve Writing' },
  { icon: CheckIcon, id: 'fix-grammar', label: 'Fix Grammar' },
  { icon: MinusIcon, id: 'make-shorter', label: 'Make Shorter' },
  { icon: PlusIcon, id: 'make-longer', label: 'Make Longer' },
  { icon: TypeIcon, id: 'simplify', label: 'Simplify Language' },
];

function getAIActionLabel(action: string) {
  const item = AI_ACTION_ITEMS.find((candidate) => {
    return candidate.id === action;
  });

  return item?.label ?? action;
}

export type AIActionsDropdownProps = {
  container?: FloatingUIContainer;
};

export function AIActionsDropdown(props: AIActionsDropdownProps) {
  const { container } = props;

  const editor = useEditorInstance();
  const [open, setOpen] = useState(false);

  const { failedAction, isLoading } = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const storage: AIActionsStorage | undefined = instance.storage.aiActions;

      return {
        failedAction: storage?.failedAction ?? null,
        isLoading: storage?.isLoading ?? false,
      };
    },
  });

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      {failedAction ? (
        <span data-mly-ai-error="" role="alert">
          <CircleAlertIcon size={14} />
          {getAIActionLabel(failedAction)} failed
          <button
            aria-label="Dismiss"
            data-mly-ai-error-dismiss=""
            onClick={() => {
              return editor.commands.dismissAIAction();
            }}
            type="button"
          >
            <XIcon size={12} />
          </button>
        </span>
      ) : (
        <BubbleButton
          container={container}
          data-variant="ai"
          disabled={isLoading}
          isActive={open}
          label="AI Actions"
          render={<DropdownMenuTrigger />}
          tooltip="AI Actions"
        >
          {isLoading ? (
            <Loader2Icon data-mly-spinner="" size={14} />
          ) : (
            <SparklesIcon size={14} />
          )}
          <span data-mly-ai-actions-label="">AI</span>
        </BubbleButton>
      )}

      <DropdownPositioner container={container}>
        <DropdownMenuPopup data-variant="ai-actions">
          {AI_ACTION_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => editor.commands.runAIAction(item.id)}
            >
              <item.icon size={15} />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuPopup>
      </DropdownPositioner>
    </DropdownMenu>
  );
}
