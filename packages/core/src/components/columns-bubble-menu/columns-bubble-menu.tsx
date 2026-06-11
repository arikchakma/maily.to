import { SpaceIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import { useColumnsState } from '~/hooks/use-columns-state';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import { addColumn, removeColumn, updateColumnWidth } from '~/utils/columns';

import { BubbleMenu } from '../interface/bubble-menu';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import { UnitField } from '../interface/unit-field';
import { ColumnsWidthConfig } from './columns-width-config';
import type { AllowedColumnVerticalAlign } from './vertical-alignment-switch';
import { VerticalAlignmentSwitch } from './vertical-alignment-switch';

type ColumnsBubbleMenuProps = {};

export function ColumnsBubbleMenu(_props: ColumnsBubbleMenuProps) {
  const editor = useEditorInstance();
  const state = useColumnsState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const {
    open,
    setOpen,
    isColumnActive,
    columnCount,
    columnWidths,
    verticalAlign,
    gap: defaultGap,
  } = state;

  const [gap, setGap] = useState(defaultGap);
  const [prevDefaultGap, setPrevDefaultGap] = useState(defaultGap);

  if (prevDefaultGap !== defaultGap) {
    setPrevDefaultGap(defaultGap);
    setGap(defaultGap);
  }

  const handleGapChange = (value: number) => {
    editor.commands.updateColumns({ gap: value });
  };

  const handleDelete = () => {
    editor.chain().focus().deleteNode('columns').run();
  };

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.COLUMNS_BUBBLE_MENU}
    >
      {isColumnActive && (
        <>
          <ColumnsWidthConfig
            container={container}
            columnsCount={columnCount}
            columnWidths={columnWidths}
            onColumnsCountChange={(count) => {
              if (count > columnCount) {
                addColumn(editor);
              } else if (count < columnCount) {
                removeColumn(editor);
              }
            }}
            onColumnWidthChange={(index, width) => {
              updateColumnWidth(editor, index, width);
            }}
          />

          <Divider />
        </>
      )}

      <VerticalAlignmentSwitch
        container={container}
        alignment={verticalAlign as AllowedColumnVerticalAlign}
        onAlignmentChange={(value) => {
          editor.commands.updateColumn({
            verticalAlign: value,
          });
        }}
      />

      <Divider />

      <UnitField
        value={gap}
        onValueChange={setGap}
        onValueCommitted={handleGapChange}
        suffix="px"
        min={0}
        max={100}
        wrapperClassName="mly:w-auto"
        className="mly:w-20"
        container={container}
        dragAreaIcon={
          <SpaceIcon className="mly:size-3.5 mly:text-midnight-gray" />
        }
      />

      <Divider />

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="mly:size-7 mly:text-red-500 mly:hover:bg-red-50 mly:hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2Icon className="mly:size-4" />
            </Button>
          }
        />
        <TooltipPositioner container={container}>
          <TooltipPopup>Delete Columns</TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
    </BubbleMenu>
  );
}
