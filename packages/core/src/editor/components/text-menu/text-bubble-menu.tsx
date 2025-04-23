import { ColumnExtension } from '@/editor/nodes/columns/column';
import { ColumnsExtension } from '@/editor/nodes/columns/columns';
import { SectionExtension } from '@/editor/nodes/section/section';
import { isCustomNodeSelected } from '@/editor/utils/is-custom-node-selected';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { LucideIcon } from 'lucide-react';
import { SVGIcon } from '../icons/grid-lines';
import { Divider } from '../ui/divider';
import { TooltipProvider } from '../ui/tooltip';
import { TextBubbleContent } from './text-bubble-content';
import { RepeatExtension } from '@/editor/nodes/repeat/repeat';
import { TurnIntoBlock } from './turn-into-block';
import { useTurnIntoBlockOptions } from './use-turn-into-block-options';

export interface BubbleMenuItem {
  name?: string;
  isActive?: () => boolean;
  command?: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon | SVGIcon;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  disbabled?: boolean;

  tooltip?: string;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  appendTo?: React.RefObject<any>;
};

export function TextBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;

  if (!editor) {
    return null;
  }

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
<<<<<<< HEAD
    pluginKey: 'textMenu',
=======
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'text-menu',
>>>>>>> main
    shouldShow: ({ editor, from, view }) => {
      if (!view || editor.view.dragging) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node) || !editor.isEditable) {
        return false;
      }

      const nestedNodes = [
        RepeatExtension.name,
        SectionExtension.name,
        ColumnsExtension.name,
        ColumnExtension.name,
      ];

      const isNestedNodeSelected =
        nestedNodes.some((name) => editor.isActive(name)) &&
        node?.classList?.contains('ProseMirror-selectednode');
      return isTextSelected(editor) && !isNestedNodeSelected;
    },
    tippyOptions: {
      popperOptions: {
        placement: 'top-start',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
            },
          },
        ],
      },
      appendTo: appendTo?.current || 'parent',
      maxWidth: '100%',
    },
  };

  const turnIntoBlockOptions = useTurnIntoBlockOptions(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
<<<<<<< HEAD
      className="mly-flex mly-gap-1 mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-0.5 mly-shadow-md"
=======
      className="mly-flex mly-gap-0.5 mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-0.5 mly-shadow-md"
>>>>>>> main
    >
      <TooltipProvider>
        <TurnIntoBlock options={turnIntoBlockOptions} />

        <Divider className="mly-mx-0" />

        <TextBubbleContent editor={editor} />
      </TooltipProvider>
    </BubbleMenu>
  );
}
