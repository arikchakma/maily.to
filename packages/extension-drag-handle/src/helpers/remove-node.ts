export function removeNode(node: HTMLElement): void {
  node.parentNode?.removeChild(node);
}
