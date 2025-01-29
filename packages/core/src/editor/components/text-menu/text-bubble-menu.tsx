import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  List,
  ListOrdered,
  LucideIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { BubbleMenuButton } from '../bubble-menu-button';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { useTextMenuState } from './use-text-menu-state';
import { isCustomNodeSelected } from '@/editor/utils/is-custom-node-selected';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { TooltipProvider } from '../ui/tooltip';
import { LinkInputPopover } from '../ui/link-input-popover';
import { Divider } from '../ui/divider';
import { AlignmentSwitch } from '../alignment-switch';
import { SVGIcon } from '../icons/grid-lines';
import { SectionExtension } from '@/editor/nodes/section/section';
import { ColumnExtension } from '@/editor/nodes/columns/column';
import { ColumnsExtension } from '@/editor/nodes/columns/columns';
import { ForExtension } from '@/editor/nodes/for/for';
import { TurnIntoBlock } from './turn-into-block';
import { useTurnIntoBlockOptions } from './use-turn-into-block-options';
import { ShowPopover } from '../show-popover';

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

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => editor?.isActive('bold')!,
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
      tooltip: 'Bold',
    },
    {
      name: 'italic',
      isActive: () => editor?.isActive('italic')!,
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
      tooltip: 'Italic',
    },
    {
      name: 'underline',
      isActive: () => editor?.isActive('underline')!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
      tooltip: 'Underline',
    },
    {
      name: 'strike',
      isActive: () => editor?.isActive('strike')!,
      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
      tooltip: 'Strikethrough',
    },
    {
      name: 'code',
      isActive: () => editor?.isActive('code')!,
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
      tooltip: 'Code',
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'textMenu',
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
        ForExtension.name,
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
      maxWidth: '100%',
    },
  };

  const state = useTextMenuState(editor);
  const turnIntoBlockOptions = useTurnIntoBlockOptions(editor);
  const colors = editor?.storage.color.colors as Set<string>;
  const suggestedColors = Array?.from(colors)?.reverse()?.slice(0, 6) ?? [];

  const showIfKey = state?.isHeadingActive
    ? state?.headingShowIfKey
    : state?.paragraphShowIfKey;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-0.5 mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <TurnIntoBlock options={turnIntoBlockOptions} />

        <Divider className="mly-mx-0" />

        {items.map((item, index) => (
          <BubbleMenuButton key={index} {...item} />
        ))}

        <AlignmentSwitch
          alignment={state.textAlign}
          onAlignmentChange={(alignment) => {
            editor?.chain().focus().setTextAlign(alignment).run();
          }}
        />

        {!state.isListActive && (
          <>
            <BubbleMenuButton
              icon={List}
              command={() => {
                editor.chain().focus().toggleBulletList().run();
              }}
              tooltip="Bullet List"
            />
            <BubbleMenuButton
              icon={ListOrdered}
              command={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}
              tooltip="Ordered List"
            />
          </>
        )}

        <LinkInputPopover
          defaultValue={state?.linkUrl ?? ''}
          onValueChange={(value, isVariable) => {
            const defaultValueWithoutProtocol = value.replace(
              /https?:\/\//,
              ''
            );

            if (!defaultValueWithoutProtocol) {
              editor
                ?.chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .unsetUnderline()
                .run();
              return;
            }

            editor
              ?.chain()
              .extendMarkRange('link')
              .setLink({ href: value })
              .setIsUrlVariable(isVariable ?? false)
              .setUnderline()
              .run()!;
          }}
          tooltip="External URL"
          editor={editor}
          isVariable={state.isUrlVariable}
        />

        <Divider className="mly-mx-0" />

        <ColorPicker
          color={state.currentTextColor}
          onColorChange={(color) => {
            editor?.chain().setColor(color).run();
          }}
          onClose={(color) => colors.add(color)}
          tooltip="Text Color"
          suggestedColors={suggestedColors}
        >
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          >
            <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
              <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
                A
              </span>
              <div
                className="mly-h-[2px] mly-w-3"
                style={{ backgroundColor: state.currentTextColor }}
              />
            </div>
          </BaseButton>
        </ColorPicker>

        <Divider className="mly-mx-0" />
        <ShowPopover
          showIfKey={showIfKey}
          onShowIfKeyValueChange={(value) => {
            editor
              ?.chain()
              .updateAttributes(
                state.isHeadingActive ? 'heading' : 'paragraph',
                {
                  showIfKey: value,
                }
              )
              .run();
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
