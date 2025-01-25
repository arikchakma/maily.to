import { JSONContent } from '@tiptap/core';

export function replaceDeprecatedNode(json: JSONContent) {
  const stack = [json];

  while (stack.length) {
    const node = stack.pop();
    if (!node) {
      continue;
    }

    if (node.type === 'for') {
      node.type = 'repeat';
    }

    if (node.content) {
      stack.push(...node.content);
    }
  }

  return json;
}
