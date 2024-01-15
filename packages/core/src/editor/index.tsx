'use client';

import { Editor as TiptapEditor, Extension, FocusPosition } from '@tiptap/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';

import { EditorBubbleMenu } from './components/editor-bubble-menu';
import { EditorMenuBar } from './components/editor-menu-bar';
import { ImageBubbleMenu } from './components/image-bubble-menu';
import { SpacerBubbleMenu } from './components/spacer-bubble-menu';
import { extensions as defaultExtensions } from './extensions';
import { cn } from './utils/classname';
import intl from 'react-intl-universal';
import es from "../locales/es";
import en from "../locales/en";
import { useEffect, useState } from 'react';

const LOCALES_LIST = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Spanish",
    value: "es"
  },
];

const LOCALE_DATA = {
  "en": en,
  "es": es
}

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor?: TiptapEditor) => void;
  onCreate?: (editor?: TiptapEditor) => void;
  extensions?: Extension[];
  variables?: string[];
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
    bodyClassName?: string;
    autofocus?: FocusPosition;
  };
  lang: string;
};

export function Editor(props: EditorProps) {
  const [initDone, setInitDone] = useState(false);

  const {
    config: {
      wrapClassName = '',
      contentClassName = '',
      bodyClassName = '',
      hasMenuBar = true,
      spellCheck = false,
      autofocus = 'end',
    } = {},
    onCreate,
    onUpdate,
    extensions,
    contentHtml,
    contentJson,
    variables,
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
    onCreate: ({ editor }) => {
      onCreate?.(editor);
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
    extensions: [
      ...defaultExtensions({
        variables,
      }),
      ...(extensions || []),
    ],
    content: formattedContent,
    autofocus,
  });

  const initializeIntl = () => {
    // 1. Get the currentLocale from url, cookie, or browser setting
    let currentLocale = props.lang;

    // 2. Fallback to "en" if the currentLocale isn't supported in LOCALES_LIST
    if (!LOCALES_LIST.some(item => item.value === currentLocale)) {
      currentLocale = "en"
    }

    // 3. Set currentLocale and load locale data 
    setCurrentLocale(currentLocale);

    // 4. After loading locale data, start to render
    setInitDone(true);
  }



  const setCurrentLocale = (currentLocale: string) => {
    intl.init({
      // debug: true,
      currentLocale,
      locales: LOCALE_DATA,
    });
  };

  useEffect(() => {
    initializeIntl();
  }, []);

  useEffect(() => {
    if(!initDone) return;
    setCurrentLocale(props.lang)
  },[props.lang])

  if (!editor || !initDone) {
    return null;
  }

  return (
    <div className={cn('mly-editor mly-antialiased', wrapClassName)}>
      {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
      <div
        className={cn(
          'mly-mt-4 mly-rounded mly-border mly-bg-white mly-p-4',
          bodyClassName
        )}
      >
        <EditorBubbleMenu editor={editor} />
        <ImageBubbleMenu editor={editor} />
        <SpacerBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
