import type { DocumentNode, TextDirection } from '@maily-to/shared';
import { DEFAULT_TEXT_DIRECTION, invariant } from '@maily-to/shared';
import type { AnyExtension, Editor, JSONContent } from '@tiptap/core';
import type { EditorEvents, UseEditorOptions } from '@tiptap/react';
import { EditorContext as TiptapEditorContext } from '@tiptap/react';
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMailyEditor } from '~/hooks/use-maily-editor';
import { getNormalizedHtml } from '~/utils/html';
import { clearInitialNodeSelection } from '~/utils/selection';

import { EditorRootContext } from './editor-root-context';

const DIRECTION_ATTRIBUTE = 'dir';

type EditorRootProps = {
  children: React.ReactNode;
  content?: JSONContent | string;
  extensions?: AnyExtension[];
  onContentError?: ((props: EditorEvents['contentError']) => void) | undefined;
  onCreate?: ((props: EditorEvents['create']) => void) | undefined;
  onUpdate?: ((props: EditorEvents['update']) => void) | undefined;
  ref?: React.Ref<EditorRootHandle>;
} & Pick<
  UseEditorOptions,
  | 'autofocus'
  | 'editable'
  | 'editorProps'
  | 'immediatelyRender'
  | 'textDirection'
>;

type EditorRootHandle = {
  getEditor: () => Editor;
  getEditorHTML: () => string;
  getJSON: () => DocumentNode;
  getText: () => string;
};

const EMITTED_CONTENT_HISTORY = 20;

const LEADING_SEPARATORS = /^(?:\n\n)+/;

function getEditorText(editor: Editor) {
  return editor.getText().replace(LEADING_SEPARATORS, '');
}

export function EditorRoot(props: EditorRoot.Props) {
  const {
    autofocus = false,
    children,
    content,
    editable = true,
    editorProps = {},
    extensions,
    immediatelyRender = true,
    onContentError,
    onCreate,
    onUpdate,
    ref,
    textDirection: textDirectionProp,
  } = props;

  const [textDirection, setTextDirection] = useState(
    textDirectionProp ?? DEFAULT_TEXT_DIRECTION
  );
  const [previousDirection, setPreviousDirection] = useState(textDirectionProp);

  if (previousDirection !== textDirectionProp) {
    setPreviousDirection(textDirectionProp);
    setTextDirection(textDirectionProp ?? DEFAULT_TEXT_DIRECTION);
  }

  const emittedRef = useRef<Set<string>>(new Set());

  const rememberEmitted = (instance: Editor) => {
    const emitted = emittedRef.current;
    emitted.add(JSON.stringify(instance.getJSON()));

    if (emitted.size > EMITTED_CONTENT_HISTORY) {
      emitted.delete(emitted.values().next().value as string);
    }
  };

  const editor = useMailyEditor(
    {
      autofocus,
      content,
      editable,
      editorProps,
      extensions,
      immediatelyRender,
      ...(onContentError ? { onContentError } : {}),
      onCreate: (event) => {
        if (autofocus === false || autofocus === null) {
          clearInitialNodeSelection(event.editor);
        }

        rememberEmitted(event.editor);
        onCreate?.(event);
      },
      onUpdate: (event) => {
        rememberEmitted(event.editor);
        onUpdate?.(event);
      },
      textDirection,
    },
    [editable, textDirection]
  );

  useEffect(() => {
    if (!editor || content === undefined) {
      return;
    }

    if (typeof content !== 'string') {
      const next = JSON.stringify(content);

      // The editor produced this document, so applying it back would either be
      // a no-op or, when the parent echoes a stale value, undo a newer edit.
      if (
        emittedRef.current.has(next) ||
        next === JSON.stringify(editor.getJSON())
      ) {
        return;
      }
    }

    editor.commands.setContent(
      typeof content === 'string' ? getNormalizedHtml(content) : content,
      { emitUpdate: false, errorOnInvalidContent: false }
    );
  }, [content, editor]);

  useImperativeHandle(ref, () => {
    const getEditor = () => {
      invariant(editor, 'Editor.Root ref accessed before the editor was ready');
      return editor;
    };

    return {
      getEditor,
      getEditorHTML: () => getEditor().getHTML(),
      getJSON: () => getEditor().getJSON() as DocumentNode,
      getText: () => getEditorText(getEditor()),
    };
  }, [editor]);

  const rootContext = useMemo(
    () => ({
      setTextDirection: (direction: TextDirection) => {
        setTextDirection(direction);
        editor?.view.dispatch(
          editor.state.tr.setDocAttribute(DIRECTION_ATTRIBUTE, direction)
        );
      },
      textDirection: textDirection ?? DEFAULT_TEXT_DIRECTION,
    }),
    [editor, textDirection]
  );

  if (!editor) {
    return null;
  }

  return (
    <TiptapEditorContext.Provider value={{ editor }}>
      <EditorRootContext value={rootContext}>
        <div data-mly-editor-root="">{children}</div>
      </EditorRootContext>
    </TiptapEditorContext.Provider>
  );
}

export namespace EditorRoot {
  export type Handle = EditorRootHandle;
  export type Props = EditorRootProps;
}
