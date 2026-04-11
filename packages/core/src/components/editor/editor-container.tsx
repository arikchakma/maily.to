import { cn } from '~/utils/classname';

type EditorContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function EditorContainer(props: EditorContainerProps) {
  const { children, className } = props;

  return (
    <div
      className={cn(
        'mly:mx-auto',
        'mly:max-w-(--mly-container-max-width)! mly:min-w-(--mly-container-min-width)!',
        'mly:bg-(--mly-container-background-color)',
        'mly:px-(--mly-container-padding-left)! mly:py-(--mly-container-padding-top)!',
        'mly:rounded-(--mly-container-border-radius)!',
        'mly:border-width-(--mly-container-border-width)! mly:border-color-(--mly-container-border-color)! mly:border-solid',
        className
      )}
    >
      {children}
    </div>
  );
}
