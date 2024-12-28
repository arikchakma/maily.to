import { useMailyContext } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenu, findChildren } from '@tiptap/react';
import {
  Braces,
  InfoIcon,
  TriangleAlert,
  TriangleAlertIcon,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { sticky } from 'tippy.js';
import { getRenderContainer } from '../../utils/get-render-container';
import { ShowPopover } from '../show-popover';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { InputAutocomplete } from '../ui/input-autocomplete';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useForState } from './use-for-state';
import { getClosestNodeByName } from '@/editor/utils/columns';
import { processVariables } from '@/editor/utils/variable';

export function ForBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const state = useForState(editor);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'for');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      const activeForNode = getClosestNodeByName(editor, 'for');
      const sectionNodeChildren = activeForNode
        ? findChildren(activeForNode?.node, (node) => {
            return node.type.name === 'section';
          })?.[0]
        : null;
      const hasActiveSectionNodeChildren =
        sectionNodeChildren && editor.isActive('section');

      if (isTextSelected(editor) || hasActiveSectionNodeChildren) {
        return false;
      }

      return editor.isActive('for');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: 'auto',
    },
    pluginKey: 'forBubbleMenu',
  };

  const { variables = [] } = useMailyContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);

  const eachKey = state?.each || '';
  const autoCompleteOptions = useMemo(() => {
    return processVariables(variables, {
      query: eachKey || '',
      editor,
      from: 'for-variable',
    }).map((variable) => variable.name);
  }, [variables, eachKey, editor]);

  const isValidEachKey = eachKey && eachKey?.startsWith('iterable.');
  const TooltipIcon = isValidEachKey ? InfoIcon : TriangleAlertIcon;
  const tooltipContent = isValidEachKey ? (
    <>
      Loop over each item in the iterable. Use{' '}
      <span className="mly-font-mono mly-font-bold">'iterable.'</span> to
      reference the iterable.
    </>
  ) : (
    <>
      Variable may not be iterable. Ensure it starts with{' '}
      <span className="mly-font-mono mly-font-bold">'iterable.'</span> to avoid
      issues.
    </>
  );

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <div className="mly-flex mly-items-center mly-gap-1.5 mly-px-1.5 mly-text-sm mly-leading-none">
          For
          <Tooltip>
            <TooltipTrigger>
              <TooltipIcon
                className={cn(
                  'mly-size-3 mly-stroke-[2.5] mly-text-gray-500',
                  !isValidEachKey && 'mly-text-rose-400'
                )}
              />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={14}
              className="mly-max-w-[260px]"
              align="start"
            >
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </div>
        {!isUpdatingKey && (
          <button
            className={cn(
              'mly-inline-grid mly-h-7 mly-min-w-28 mly-max-w-xs mly-grid-cols-[12px_1fr] mly-items-center mly-gap-1.5 mly-rounded-md mly-border mly-px-2 mly-font-mono mly-text-sm hover:mly-bg-soft-gray',
              !isValidEachKey &&
                'mly-border-rose-400 mly-bg-rose-50 mly-text-rose-600 hover:mly-bg-rose-100'
            )}
            onClick={() => {
              setIsUpdatingKey(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            <Braces className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5] mly-text-rose-600" />
            <span className="mly-min-w-0 mly-truncate mly-text-left">
              {state?.each}
            </span>
          </button>
        )}
        {isUpdatingKey && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsUpdatingKey(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsUpdatingKey(false);
              }
            }}
          >
            <InputAutocomplete
              placeholder="iterable.variable"
              value={state?.each || ''}
              onValueChange={(value) => {
                editor.commands.updateFor({
                  each: value,
                });
              }}
              onOutsideClick={() => {
                setIsUpdatingKey(false);
              }}
              onSelectOption={(value) => {
                editor.commands.updateFor({
                  each: value,
                });
                setIsUpdatingKey(false);
              }}
              autoCompleteOptions={autoCompleteOptions}
              ref={inputRef}
            />
          </form>
        )}

        <Divider />
        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor.commands.updateFor({
              showIfKey: value,
            });
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
