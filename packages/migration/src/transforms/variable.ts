export function variable(node: Record<string, any>): void {
  const attrs = node.attrs;
  if (!attrs || !('hideDefaultValue' in attrs)) {
    return;
  }

  attrs.isDefaultEditable = attrs.hideDefaultValue !== true;
  delete attrs.hideDefaultValue;
}
