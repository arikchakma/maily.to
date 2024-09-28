import { Editor } from '@tiptap/react';
import { Node } from '@tiptap/pm/model';

export function getColumnCount(editor: Editor) {
  let columnsNode: Node | undefined;
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'columns') {
      columnsNode = node;
    }
  });

  if (!columnsNode) {
    return 0;
  }

  return columnsNode.childCount;
}
