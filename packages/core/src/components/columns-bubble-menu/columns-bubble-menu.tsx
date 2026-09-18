import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { SpaceIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import { useColumnsState } from '~/hooks/use-columns-state';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import { addColumn, removeColumn, updateColumnWidth } from '~/utils/columns';

import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { UnitField } from '../interface/unit-field';
import { ColumnsWidthConfig } from './columns-width-config';
import { VerticalAlignmentSwitch } from './vertical-alignment-switch';

export const MIN_COLUMNS_GAP = 0;
export const MAX_COLUMNS_GAP = 100;

export function ColumnsBubbleMenu() {
  const editor = useEditorInstance();
  const {
    columnCount,
    columnWidths,
    gap: committedGap,
    isColumnActive,
    open,
    setOpen,
    verticalAlign,
  } = useColumnsState(editor);
  const container = useRef<HTMLDivElement>(null);

  const [gap, setGap] = useState(committedGap);
  const [previousGap, setPreviousGap] = useState(committedGap);

  if (previousGap !== committedGap) {
    setPreviousGap(committedGap);
    setGap(committedGap);
  }

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.COLUMNS_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      {isColumnActive ? (
        <>
          <ColumnsWidthConfig
            columnsCount={columnCount}
            columnWidths={columnWidths}
            container={container}
            onColumnsCountChange={(count) => {
              if (count > columnCount) {
                addColumn(editor);
              } else if (count < columnCount) {
                removeColumn(editor);
              }
            }}
            onColumnWidthChange={(index, width) =>
              updateColumnWidth(editor, index, width)
            }
          />

          <Divider />
        </>
      ) : null}

      <VerticalAlignmentSwitch
        align={verticalAlign}
        container={container}
        onAlignChange={(value) =>
          editor.chain().updateColumn({ verticalAlign: value }).run()
        }
      />

      <Divider />

      <UnitField
        dragAreaIcon={<SpaceIcon size={14} />}
        label="Gap"
        max={MAX_COLUMNS_GAP}
        min={MIN_COLUMNS_GAP}
        onValueChange={setGap}
        onValueCommitted={(value) =>
          editor.chain().updateColumns({ gap: value }).run()
        }
        suffix="px"
        value={gap}
      />

      <Divider />

      <BubbleButton
        container={container}
        icon={Trash2Icon}
        label="Delete Columns"
        tooltip="Delete Columns"
        onClick={() =>
          editor.chain().focus().deleteNode(MAILY_NODE_TYPES.COLUMNS).run()
        }
      />
    </BubbleMenu>
  );
}
