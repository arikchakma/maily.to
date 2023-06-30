import { Button } from "@/components/ui/button";
import { BubbleMenuItem } from "./editor-bubble-menu";
import { cn } from "@/lib/utils";

export function BubbleMenuButton(item: BubbleMenuItem) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={item.command}
      data-state={item.isActive()}
      className={cn('px-2.5')}
    >
      {
        item.icon ?
          <item.icon
            className={cn("h-3.5 w-3.5")}
          /> : (
            <span className="text-sm font-medium text-slate-600">
              {item.name}
            </span>
          )
      }
    </Button>
  )
}
