import {
  DEFAULT_RENDER_VARIABLE_FUNCTION,
  useMailyContext,
} from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenu, findChildren } from '@tiptap/react';
import { InfoIcon } from 'lucide-react';
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
import { useRepeatState } from './use-repeat-state';
import { getClosestNodeByName } from '@/editor/utils/columns';
import { processVariables } from '@/editor/utils/variable';

export function RepeatBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const state = useRepeatState(editor);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'repeat');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      const activeForNode = getClosestNodeByName(editor, 'repeat');
      const sectionNodeChildren = activeForNode
        ? findChildren(activeForNode?.node, (node) => {
            return node.type.name === 'section';
          })?.[0]
        : null;
      const hasActiveSectionNodeChildren =
        sectionNodeChildren && editor.isActive('section');

      if (
        isTextSelected(editor) ||
        hasActiveSectionNodeChildren ||
        !editor.isEditable
      ) {
        return false;
      }

      return editor.isActive('repeat');
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
    pluginKey: 'repeatBubbleMenu',
  };

  const { variables = [], renderVariable = DEFAULT_RENDER_VARIABLE_FUNCTION } =
    useMailyContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);

  const eachKey = state?.each || '';
  const autoCompleteOptions = useMemo(() => {
    return processVariables(variables, {
      query: eachKey || '',
      editor,
      from: 'repeat-variable',
    }).map((variable) => variable.name);
  }, [variables, eachKey, editor]);

  const isValidEachKey = eachKey;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <div className="mly-flex mly-items-center mly-gap-1.5 mly-px-1.5 mly-text-sm mly-leading-none">
          Repeat
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon
                className={cn('mly-size-3 mly-stroke-[2.5] mly-text-gray-500')}
              />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={14}
              className="mly-max-w-[260px]"
              align="start"
            >
              Ensure the selected variable is iterable, such as an array of
              objects.
            </TooltipContent>
          </Tooltip>
        </div>
        {!isUpdatingKey && (
          <button
            onClick={() => {
              setIsUpdatingKey(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            {renderVariable({
              variable: {
                name: state?.each,
                valid: isValidEachKey,
              },
              fallback: '',
              from: 'bubble-variable',
              editor,
            })}
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
              placeholder="ie. payload.items"
              value={state?.each || ''}
              onValueChange={(value) => {
                editor.commands.updateRepeat({
                  each: value,
                });
              }}
              onOutsideClick={() => {
                setIsUpdatingKey(false);
              }}
              onSelectOption={(value) => {
                editor.commands.updateRepeat({
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
            editor.commands.updateRepeat({
              showIfKey: value,
            });
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
