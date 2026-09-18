import { Columns2Icon, Columns3Icon, SlidersVerticalIcon } from 'lucide-react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { UnitField } from '../interface/unit-field';

const MIN_COLUMN_WIDTH = 10;

const COLUMN_COUNT_OPTIONS = [
  { icon: Columns2Icon, label: '2 Columns', value: 2 },
  { icon: Columns3Icon, label: '3 Columns', value: 3 },
] as const;

function getColumnLabel(index: number, columnsCount: number) {
  if (index === 0) {
    return 'Left';
  }

  if (index === columnsCount - 1) {
    return 'Right';
  }

  return 'Middle';
}

function getMaxColumnWidth(columnWidths: (number | null)[], index: number) {
  const othersTotal = columnWidths.reduce<number>(
    (sum, width, position) =>
      position === index ? sum : sum + (width ?? MIN_COLUMN_WIDTH),
    0
  );

  return 100 - othersTotal;
}

export type ColumnsWidthConfigProps = {
  columnsCount: number;
  columnWidths: (number | null)[];
  container: FloatingUIContainer;
  onColumnsCountChange: (columnsCount: number) => void;
  onColumnWidthChange: (index: number, width: number | null) => void;
};

export function ColumnsWidthConfig(props: ColumnsWidthConfigProps) {
  const {
    columnsCount,
    columnWidths,
    container,
    onColumnsCountChange,
    onColumnWidthChange,
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        icon={SlidersVerticalIcon}
        isActive={open}
        label="Column Settings"
        render={<PopoverTrigger />}
        tooltip="Column Settings"
      />

      <PopoverPositioner container={container} side="bottom">
        <PopoverPopup data-variant="columns-width" initialFocus={false}>
          <div data-mly-columns-count-switch="" role="group">
            {COLUMN_COUNT_OPTIONS.map((option) => (
              <Button
                data-active={option.value === columnsCount ? '' : undefined}
                data-mly-columns-count-button=""
                key={option.value}
                onClick={() => onColumnsCountChange(option.value)}
              >
                <option.icon size={14} />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>

          <Divider type="horizontal" />

          <div
            data-mly-column-width-fields=""
            style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
          >
            {Array.from({ length: columnsCount }).map((_, index) => {
              const label = getColumnLabel(index, columnsCount);
              const width = columnWidths[index];

              return (
                <div data-mly-column-width-field="" key={index}>
                  <span data-mly-column-width-label="">{label}</span>
                  <UnitField
                    displayValue={width === null ? 'auto' : undefined}
                    label={`${label} Column Width`}
                    max={getMaxColumnWidth(columnWidths, index)}
                    min={MIN_COLUMN_WIDTH}
                    onValueChange={(next) => onColumnWidthChange(index, next)}
                    onValueCommitted={(next) =>
                      onColumnWidthChange(index, next)
                    }
                    suffix="%"
                    value={width ?? 0}
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
