import type { EditorThemeOptions, TextDirection } from '@maily-to/shared';
import {
  deepMerge,
  DEFAULT_EDITOR_THEME,
  DEFAULT_TEXT_DIRECTION,
} from '@maily-to/shared';
import type { AnyExtension, JSONContent } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { EditorEvents, UseEditorOptions } from '@tiptap/react';
import { EditorContext as TiptapEditorContext } from '@tiptap/react';
import { useMemo } from 'react';

import { useControllableState } from '~/hooks/use-controllable-state';
import { useMailyEditor } from '~/hooks/use-maily-editor';
import { getInitialEditorContent } from '~/utils/initial-content';
import { clearInitialNodeSelection } from '~/utils/selection';

import { EditorRootContext } from './editor-root-context';

type EditorRootProps = {
  content?: JSONContent | string;
  extensions?: AnyExtension[];
  onUpdate?: ((props: EditorEvents['update']) => void) | undefined;
  onCreate?: ((props: EditorEvents['create']) => void) | undefined;

  textDirection?: TextDirection;
  defaultTextDirection?: TextDirection;
  onTextDirectionChange?: (direction: TextDirection) => void;

  theme?: EditorThemeOptions;

  children: React.ReactNode;
} & Pick<
  UseEditorOptions,
  'immediatelyRender' | 'autofocus' | 'editable' | 'editorProps'
>;

export function EditorRoot(props: EditorRootProps) {
  const {
    content,
    onUpdate,
    onCreate,
    extensions,
    theme: themeProp = {},
    defaultTextDirection,
    textDirection: textDirectionProp,
    onTextDirectionChange,
    children,

    editable = true,
    immediatelyRender = true,
    autofocus = false,
    editorProps,
  } = props;

  const theme = deepMerge(DEFAULT_EDITOR_THEME, themeProp);

  const [textDirection, setTextDirection] = useControllableState({
    value: textDirectionProp,
    defaultValue: defaultTextDirection ?? DEFAULT_TEXT_DIRECTION,
    onChange: onTextDirectionChange,
  });

  const editor = useMailyEditor(
    {
      content: getInitialEditorContent(content),
      editorProps: {
        scrollMargin: 40,
        scrollThreshold: 40,
        attributes: {
          spellcheck: 'false',
          class: 'mly:w-full',
        },
        handleTripleClick(view, pos) {
          const { state } = view;
          const $pos = state.doc.resolve(pos);
          const { depth } = $pos;

          if (depth < 1) {
            return false;
          }

          const node = $pos.node(depth);
          if (node.type.spec.selectable === false) {
            return false;
          }

          const nodePos = $pos.before(depth);
          const selection = NodeSelection.create(state.doc, nodePos);
          view.dispatch(state.tr.setSelection(selection));

          return true;
        },
        ...editorProps,
      },
      extensions,
      textDirection,
      onUpdate,
      onCreate: (props) => {
        if (autofocus === false || autofocus === null) {
          clearInitialNodeSelection(props.editor);
        }

        onCreate?.(props);
      },
      editable,
      immediatelyRender,
      autofocus,
    },
    [textDirection, editable]
  );

  const contextValue: EditorRootContext = useMemo(
    () => ({
      textDirection,
      setTextDirection,
      theme,
    }),
    [textDirection, setTextDirection, theme]
  );

  if (!editor) {
    return null;
  }

  return (
    <TiptapEditorContext.Provider value={{ editor }}>
      <EditorRootContext.Provider value={contextValue}>
        {children}
      </EditorRootContext.Provider>
    </TiptapEditorContext.Provider>
  );
}
