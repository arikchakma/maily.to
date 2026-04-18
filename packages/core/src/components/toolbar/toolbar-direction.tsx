import { useEditorRootContext } from '../editor/editor-root-context';
import { ToggleDirectionPopover } from '../interface/toggle-direction-popover';
import { useToolbarContext } from './toolbar-context';

type ToolbarDirectionProps = {
  className?: string;
};

export function ToolbarDirection(props: ToolbarDirection.Props) {
  const { className: _className } = props;

  const { container } = useToolbarContext();
  const { textDirection, setTextDirection } = useEditorRootContext();

  return (
    <ToggleDirectionPopover
      container={container}
      direction={textDirection}
      onDirectionChange={setTextDirection}
    />
  );
}

export namespace ToolbarDirection {
  export type Props = ToolbarDirectionProps;
}
