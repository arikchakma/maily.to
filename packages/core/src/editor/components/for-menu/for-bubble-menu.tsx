import { useMailyContext } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenu } from '@tiptap/react';
import { Braces } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { sticky } from 'tippy.js';
import { getRenderContainer } from '../../utils/get-render-container';
import { ShowPopover } from '../show-popover';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { InputAutocomplete } from '../ui/input-autocomplete';
import { TooltipProvider } from '../ui/tooltip';
import { useForState } from './use-for-state';

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
    shouldShow: ({ editor }) => {
      if (isTextSelected(editor)) {
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
      appendTo: appendTo?.current || 'parent',
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: 'auto',
    },
    pluginKey: 'forBubbleMenu',
  };

  const { variables = [] } = useMailyContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);

  const isValidEachKey = state?.each !== undefined && state?.each !== '';
  const autoCompleteOptions = useMemo(() => {
    return variables
      ?.filter((variable) => variable.iterable)
      .map((variable) => variable.name);
  }, [variables]);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <span className="mly-flex mly-items-center mly-px-1.5 mly-text-sm mly-leading-none">
          For
        </span>
        {!isUpdatingKey && (
          <button
            className={cn(
              'mly-flex mly-h-7 mly-min-w-28 mly-items-center mly-gap-1.5 mly-rounded-md mly-border mly-border-gray-200 mly-px-2 mly-font-mono mly-text-sm hover:mly-bg-soft-gray',
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
            <Braces className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-rose-600" />
            <span>{state?.each}</span>
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
              value={state?.each || ''}
              onValueChange={(value) => {
                editor.commands.updateFor({
                  each: value,
                });
              }}
              onBlur={() => {
                setIsUpdatingKey(false);
              }}
              onSelectOption={() => {
                setIsUpdatingKey(false);
              }}
              autoCompleteOptions={autoCompleteOptions}
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
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
