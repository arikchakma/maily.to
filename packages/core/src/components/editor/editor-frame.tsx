import type { ComponentPropsWithRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

type EditorFrameProps = ComponentPropsWithRef<'div'>;

export function EditorFrame(props: EditorFrame.Props) {
  const editor = useEditorInstance();

  return (
    <div
      {...props}
      data-editable={editor.isEditable ? '' : undefined}
      data-mly-editor-body=""
    />
  );
}

export namespace EditorFrame {
  export type Props = EditorFrameProps;
}
