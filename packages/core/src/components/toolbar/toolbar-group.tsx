import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';

export type ToolbarGroupProps = ToolbarPrimitive.Group.Props;

export function ToolbarGroup(props: ToolbarGroupProps) {
  return <ToolbarPrimitive.Group data-mly-toolbar-group="" {...props} />;
}
