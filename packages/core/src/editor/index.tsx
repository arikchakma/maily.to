'use client';

import {
  AnyExtension,
  FocusPosition,
  Editor as TiptapEditor,
} from '@tiptap/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';

import { useMemo, useRef } from 'react';
import { ColumnsBubbleMenu } from './components/column-menu/columns-bubble-menu';
import { ContentMenu } from './components/content-menu';
import { EditorMenuBar } from './components/editor-menu-bar';
import { RepeatBubbleMenu } from './components/repeat-menu/repeat-bubble-menu';
import { ImageBubbleMenu } from './components/image-menu/image-bubble-menu';
import { SectionBubbleMenu } from './components/section-menu/section-bubble-menu';
import { SpacerBubbleMenu } from './components/spacer-menu/spacer-bubble-menu';
import { TextBubbleMenu } from './components/text-menu/text-bubble-menu';
import { extensions as defaultExtensions } from './extensions';
import {
  DEFAULT_PLACEHOLDER_URL,
  DEFAULT_RENDER_VARIABLE_FUNCTION,
  DEFAULT_VARIABLE_TRIGGER_CHAR,
  DEFAULT_VARIABLES,
  MailyContextType,
  MailyProvider,
} from './provider';
import { cn } from './utils/classname';
import { replaceDeprecatedNode } from './utils/replace-deprecated';
import { DEFAULT_SLASH_COMMANDS } from './extensions/slash-command/default-slash-commands';

type ParitialMailContextType = Partial<MailyContextType>;

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor: TiptapEditor) => void;
  onCreate?: (editor: TiptapEditor) => void;
  extensions?: AnyExtension[];
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

  editable?: boolean;
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
    blocks = DEFAULT_SLASH_COMMANDS,
    variables = DEFAULT_VARIABLES,
    variableTriggerCharacter = DEFAULT_VARIABLE_TRIGGER_CHAR,
    renderVariable = DEFAULT_RENDER_VARIABLE_FUNCTION,
    editable = true,
    placeholderUrl = DEFAULT_PLACEHOLDER_URL,
  } = props;

  const formattedContent = useMemo(() => {
    if (contentJson) {
      const json =
        contentJson?.type === 'doc'
          ? contentJson
          : ({
              type: 'doc',
              content: contentJson,
            } as JSONContent);

      return replaceDeprecatedNode(json);
    } else if (contentHtml) {
      return contentHtml;
    } else {
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };
    }
  }, [contentHtml, contentJson]);

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
    extensions: defaultExtensions({
      variables,
      variableTriggerCharacter,
      extensions,
      blocks,
    }),
    content: formattedContent,
    autofocus,
    editable,
  });

  if (!editor) {
    return null;
  }

  return (
    <MailyProvider
      variables={variables}
      variableTriggerCharacter={variableTriggerCharacter}
      renderVariable={renderVariable}
      placeholderUrl={placeholderUrl}
    >
      <div
        className={cn(
          'mly-editor mly-antialiased',
          editor.isEditable ? 'mly-editable' : 'mly-not-editable',
          wrapClassName
        )}
        ref={menuContainerRef}
      >
        {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
        <div
          className={cn(
            'mly-mt-4 mly-rounded mly-border mly-bg-white mly-p-4',
            bodyClassName
          )}
        >
          <TextBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <SpacerBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent editor={editor} />
          <SectionBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ColumnsBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ContentMenu editor={editor} />
          <RepeatBubbleMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </MailyProvider>
  );
}
