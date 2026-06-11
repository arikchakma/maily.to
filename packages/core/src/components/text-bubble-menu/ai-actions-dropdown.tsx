import type { AIActionsStorage } from '@maily-to/extension-ai-actions';
import {
  CheckIcon,
  Loader2Icon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  TypeIcon,
  WandSparklesIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { BubbleButton } from '../interface/bubble-button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuTrigger,
  DropdownPositioner,
} from '../interface/dropdown-menu';

type AIActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const AI_ACTION_ITEMS: AIActionItem[] = [
  { id: 'improve', label: 'Improve Writing', icon: WandSparklesIcon },
  { id: 'fix-grammar', label: 'Fix Grammar', icon: CheckIcon },
  { id: 'make-shorter', label: 'Make Shorter', icon: MinusIcon },
  { id: 'make-longer', label: 'Make Longer', icon: PlusIcon },
  { id: 'simplify', label: 'Simplify Language', icon: TypeIcon },
];

type AIActionsDropdownProps = {
  container: FloatingUIContainer;
};

export function AIActionsDropdown(props: AIActionsDropdownProps) {
  const { container } = props;

  const editor = useEditorInstance();
  const [open, setOpen] = useState(false);

  const storage = (
    editor.storage as unknown as Record<string, AIActionsStorage>
  ).aiActions;
  const isLoading = storage?.isLoading ?? false;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <BubbleButton
            label="AI Actions"
            variant="ghost"
            size="default"
            className="mly:gap-1 mly:px-1.5"
            data-active={open}
            tooltip="AI Actions"
            container={container}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="mly:size-3.5 mly:animate-spin" />
            ) : (
              <SparklesIcon className="mly:size-3.5" />
            )}
            <span className="mly:ml-1 mly:text-xs">AI</span>
          </BubbleButton>
        }
      />

      <DropdownPositioner container={container}>
        <DropdownMenuPopup
          className={cn('mly:flex mly:w-[180px] mly:flex-col')}
        >
          {AI_ACTION_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => {
                editor.commands.runAIAction(item.id);
              }}
            >
              <item.icon className="mly:size-[15px] mly:shrink-0" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuPopup>
      </DropdownPositioner>
    </DropdownMenu>
  );
}
