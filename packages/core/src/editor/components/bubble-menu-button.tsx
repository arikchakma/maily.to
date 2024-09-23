import { BaseButton } from '@/editor/components/base-button';
import { cn } from '@/editor/utils/classname';
import { BubbleMenuItem } from './text-menu/text-bubble-menu';

export function BubbleMenuButton(item: BubbleMenuItem) {
  return (
    <BaseButton
      variant="ghost"
      size="sm"
      onClick={item.command}
      data-state={item.isActive()}
      className={cn('mly-px-2.5', item?.className)}
      type="button"
    >
      {item.icon ? (
        <item.icon
          className={cn('shrink-0 mly-h-3.5 mly-w-3.5', item?.iconClassName)}
        />
      ) : (
        <span
          className={cn(
            'mly-text-sm mly-font-medium mly-text-slate-600',
            item?.nameClassName
          )}
        >
          {item.name}
        </span>
      )}
    </BaseButton>
  );
}
