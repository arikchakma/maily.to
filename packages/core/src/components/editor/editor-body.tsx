import { getMailyCssVariables } from '@maily-to/shared';
import { useMemo } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { cn } from '~/utils/classname';

import { useEditorRootContext } from './editor-root-context';

type EditorBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export function EditorBody(props: EditorBody.Props) {
  const { children, className } = props;
  const editor = useEditorInstance();
  const { theme } = useEditorRootContext();

  const cssVariables = useMemo(() => getMailyCssVariables(theme), [theme]);

  return (
    <div
      id="mly-editor"
      className={cn(
        'mly-editor mly:antialiased',
        'mly:bg-(--mly-body-background-color) mly:px-(--mly-body-padding-left) mly:py-(--mly-body-padding-top) mly:[font-family:var(--mly-font)]',
        editor.isEditable
          ? 'mly-editable mly:cursor-text'
          : 'mly-not-editable mly:cursor-default',
        className
      )}
      style={cssVariables}
    >
      {children}
    </div>
  );
}

export namespace EditorBody {
  export type Props = EditorBodyProps;
}
