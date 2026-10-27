import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';

import { useEditorRootContext } from '../editor/editor-root-context';
import { ToggleDirectionPopover } from '../interface/toggle-direction-popover';

export function ToolbarDirection() {
  const { setTextDirection, textDirection } = useEditorRootContext();

  return (
    <ToggleDirectionPopover
      direction={textDirection}
      trigger={<ToolbarPrimitive.Button />}
      onDirectionChange={setTextDirection}
    />
  );
}
