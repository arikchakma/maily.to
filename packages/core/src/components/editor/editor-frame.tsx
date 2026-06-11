import { EditorBody } from './editor-body';
import { EditorContainer } from './editor-container';

type EditorFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function EditorFrame(props: EditorFrame.Props) {
  const { children, className } = props;

  return (
    <EditorBody className={className}>
      <EditorContainer>{children}</EditorContainer>
    </EditorBody>
  );
}

export namespace EditorFrame {
  export type Props = EditorFrameProps;
}
