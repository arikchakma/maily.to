import { Columns2Icon, Columns3Icon, SlidersVerticalIcon } from 'lucide-react';

import { cn } from '~/utils/classname';

import { Button } from '../interface/button';
import {
  Popover,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import { UnitField } from '../interface/unit-field';

type ColumnsWidthConfigProps = {
  container: React.RefObject<HTMLDivElement | null>;
  columnsCount: number;
  onColumnsCountChange: (columns: number) => void;
  columnWidths: (number | null)[];
  onColumnWidthChange?: (index: number, width: number | null) => void;
};

export function ColumnsWidthConfig(props: ColumnsWidthConfigProps) {
  const {
    container,
    columnsCount = 2,
    onColumnsCountChange,
    columnWidths,
    onColumnWidthChange,
  } = props;

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon" className="mly:size-7">
                  <SlidersVerticalIcon className="mly:size-4" />
                </Button>
              }
            />
          }
        />
        <TooltipPositioner container={container}>
          <TooltipPopup>Column Settings</TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
      <PopoverPositioner container={container} sideOffset={8} side="bottom">
        <PopoverPopup className="mly:w-[280px] mly:p-1">
          <div className="mly:grid mly:grid-cols-2 mly:gap-1">
            <SwitchButton
              onClick={() => onColumnsCountChange(2)}
              isActive={columnsCount === 2}
            >
              <Columns2Icon className="mly:size-4" />
              <span>2 Columns</span>
            </SwitchButton>
            <SwitchButton
              onClick={() => onColumnsCountChange(3)}
              isActive={columnsCount === 3}
            >
              <Columns3Icon className="mly:size-4" />
              <span>3 Columns</span>
            </SwitchButton>
          </div>

          <hr className="mly:my-1 mly:border-gray-200" />

          <div
            className="mly:grid mly:gap-1.5 mly:p-1"
            style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
          >
            {Array.from({ length: columnsCount }).map((_, index) => {
              const width = columnWidths[index];
              const label =
                columnsCount === 2
                  ? index === 0
                    ? 'Left'
                    : 'Right'
                  : index === 0
                    ? 'Left'
                    : index === 1
                      ? 'Middle'
                      : 'Right';

              const MIN_COLUMN_WIDTH = 10;
              const othersTotal = columnWidths.reduce<number>(
                (sum, w, i) =>
                  i === index ? sum : sum + (w ?? MIN_COLUMN_WIDTH),
                0
              );
              const maxWidth = 100 - othersTotal;

              return (
                <div className="mly:flex mly:flex-col mly:gap-1" key={index}>
                  <span className="mly:text-xs mly:text-gray-400">{label}</span>
                  <UnitField
                    value={width ?? 0}
                    displayValue={width === null ? 'auto' : undefined}
                    suffix="%"
                    min={MIN_COLUMN_WIDTH}
                    max={maxWidth}
                    onValueChange={(val) => onColumnWidthChange?.(index, val)}
                    onValueCommitted={(val) =>
                      onColumnWidthChange?.(index, val)
                    }
                  />
                </div>
              );
            })}
          </div>
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}

type SwitchButtonProps = {
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

function SwitchButton(props: SwitchButtonProps) {
  const { onClick, isActive = false, children } = props;

  return (
    <button
      className={cn(
        'mly:flex mly:h-7 mly:items-center mly:gap-1.5 mly:rounded-md mly:px-2 mly:text-sm mly:text-gray-500 mly:hover:bg-soft-gray mly:hover:text-midnight-gray',
        isActive && 'mly:bg-soft-gray mly:text-midnight-gray'
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
