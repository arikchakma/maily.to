import type { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

type ExitOnTripleEnterOptions = {
  /**
   * The depth offset for the node to exit *after*.
   * `0` (default) exits after the matched node itself (e.g. section).
   * `-1` exits after the parent of the matched node (e.g. column → exits after columns).
   */
  exitDepthOffset?: number;
};

/**
 * Exits a container node when the user presses Enter three times
 * (i.e. the last three children are empty). Deletes the trailing
 * empty blocks and inserts a paragraph after the container.
 */
export function exitOnTripleEnter(
  editor: Editor,
  nodeName: string,
  options: ExitOnTripleEnterOptions = {}
): boolean {
  const { exitDepthOffset = 0 } = options;
  const { state } = editor;
  const { $from, empty } = state.selection;

  if (!empty) {
    return false;
  }

  let nodeDepth = -1;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === nodeName) {
      nodeDepth = d;
      break;
    }
  }

  if (nodeDepth === -1) {
    return false;
  }

  const node = $from.node(nodeDepth);
  const lastChildIndex = node.childCount - 1;

  // Must have 3+ children, cursor in the last, and last 3 all empty
  if (
    node.childCount < 3 ||
    $from.index(nodeDepth) !== lastChildIndex ||
    $from.parent.content.size !== 0 ||
    node.child(lastChildIndex - 1).content.size !== 0 ||
    node.child(lastChildIndex - 2).content.size !== 0
  ) {
    return false;
  }

  const exitDepth = nodeDepth + exitDepthOffset;
  const deleteCount = Math.min(3, node.childCount - 1);
  const nodeStart = $from.start(nodeDepth);

  let deleteFrom = nodeStart;
  for (let i = 0; i < node.childCount - deleteCount; i++) {
    deleteFrom += node.child(i).nodeSize;
  }

  return editor
    .chain()
    .command(({ tr }) => {
      const afterNode = $from.after(exitDepth);
      tr.delete(deleteFrom, $from.end(nodeDepth));

      const mappedPos = tr.mapping.map(afterNode);
      tr.insert(mappedPos, editor.schema.nodes.paragraph.create());
      tr.setSelection(TextSelection.near(tr.doc.resolve(mappedPos + 1)));
      return true;
    })
    .run();
}
