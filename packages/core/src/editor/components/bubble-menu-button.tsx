import { BaseButton } from '@/editor/components/base-button';
import { cn } from '@/editor/utils/classname';

import { BubbleMenuItem } from './editor-bubble-menu';

export function BubbleMenuButton(item: BubbleMenuItem) {
  return (
    <BaseButton
      variant="ghost"
      size="sm"
      onClick={item.command}
      data-state={item.isActive()}
      className={cn('mly-px-2.5')}
    >
      {item.icon ? (
        <item.icon className={cn('mly-h-3.5 mly-w-3.5')} />
      ) : (
        <span className="mly-text-sm mly-font-medium mly-text-slate-600">
          {item.name}
        </span>
      )}
    </BaseButton>
  );
}
