'use client';

import { Extension, FocusPosition, Editor as TiptapEditor } from '@tiptap/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';

import { useRef } from 'react';
import { ColumnsBubbleMenu } from './components/column-menu/columns-bubble-menu';
import { ContentMenu } from './components/content-menu';
import { EditorMenuBar } from './components/editor-menu-bar';
import { ForBubbleMenu } from './components/for-menu/for-bubble-menu';
import { ImageBubbleMenu } from './components/image-menu/image-bubble-menu';
import { SectionBubbleMenu } from './components/section-menu/section-bubble-menu';
import { SpacerBubbleMenu } from './components/spacer-menu/spacer-bubble-menu';
import { TextBubbleMenu } from './components/text-menu/text-bubble-menu';
import { extensions as defaultExtensions } from './extensions';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';
import {
  DEFAULT_TRIGGER_SUGGESTION_CHAR,
  MailyContextType,
  MailyProvider,
} from './provider';
import { cn } from './utils/classname';
import { RefObject } from 'react';
import { useMemo } from 'react';

type ParitialMailContextType = Partial<MailyContextType>;

export type MailyEditor = TiptapEditor;

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor: MailyEditor) => void;
  onCreate?: (editor: MailyEditor) => void;
  extensions?: Extension[];
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
    bodyClassName?: string;
    autofocus?: FocusPosition;
    immediatelyRender?: boolean;
  };

  /*
   * By default, bubble menus will be rendered inside the editor.
   * If you want to render them outside the editor, you can pass a ref to the container element.
   * it will be helpful when you have overflow hidden in the editor.
   */
  bubbleMenuAppendTo?: RefObject<any>;
} & ParitialMailContextType;

export function Editor(props: EditorProps) {
  const {
    config: {
      wrapClassName = '',
      contentClassName = '',
      bodyClassName = '',
      hasMenuBar = true,
      spellCheck = false,
      autofocus = 'end',
      immediatelyRender = false,
    } = {},
    onCreate,
    onUpdate,
    extensions,
    contentHtml,
    contentJson,
    variables,
    blocks = DEFAULT_SLASH_COMMANDS,
    triggerSuggestionCharacter = DEFAULT_TRIGGER_SUGGESTION_CHAR,

    bubbleMenuAppendTo,
  } = props;

  let formattedContent: any = null;
  if (contentJson) {
    formattedContent =
      contentJson?.type === 'doc'
        ? contentJson
        : {
            type: 'doc',
            content: contentJson,
          };
  } else if (contentHtml) {
    formattedContent = contentHtml;
  } else {
    formattedContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };
  }

  const menuContainerRef = useRef(null);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(`mly-prose mly-w-full`, contentClassName),
        spellCheck: spellCheck ? 'true' : 'false',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
    immediatelyRender,
    onCreate: ({ editor }) => {
      onCreate?.(editor);
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
    extensions: [
      ...defaultExtensions({
        variables,
        blocks,
        triggerSuggestionCharacter,
      }),
      ...(extensions || []),
    ],
    content: formattedContent,
    autofocus,
  });

  const appendTo = useMemo(() => {
    return bubbleMenuAppendTo || menuContainerRef;
  }, [bubbleMenuAppendTo, menuContainerRef]);

  if (!editor) {
    return null;
  }

  return (
    <MailyProvider
      variables={variables}
      blocks={blocks}
      triggerSuggestionCharacter={triggerSuggestionCharacter}
    >
      <div
        className={cn('mly-editor mly-antialiased', wrapClassName)}
        ref={menuContainerRef}
      >
        {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
        <div
          className={cn(
            'mly-mt-4 mly-rounded mly-border mly-border-gray-200 mly-bg-white mly-p-4',
            bodyClassName
          )}
        >
          <EditorContent editor={editor} />

          <ContentMenu editor={editor} />
          <TextBubbleMenu editor={editor} appendTo={appendTo} />
          <ImageBubbleMenu editor={editor} appendTo={appendTo} />
          <SpacerBubbleMenu editor={editor} appendTo={appendTo} />
          <SectionBubbleMenu editor={editor} appendTo={appendTo} />
          <ColumnsBubbleMenu editor={editor} appendTo={appendTo} />
          <ForBubbleMenu editor={editor} appendTo={appendTo} />
        </div>
      </div>
    </MailyProvider>
  );
}
