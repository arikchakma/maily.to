import { Command } from '@tiptap/core';

export function updateAttribute(
  type: string,
  attr: string,
  value: any
): Command {
  return ({ commands }) =>
    commands.command(({ tr, state, dispatch }) => {
      if (dispatch) {
        let lastPos = null;

        tr.selection.ranges.forEach((range) => {
          state.doc.nodesBetween(
            range.$from.pos,
            range.$to.pos,
            (node, pos) => {
              if (node.type.name === type) {
                lastPos = pos;
              }
            }
          );
        });

        if (lastPos !== null) {
          tr.setNodeAttribute(lastPos, attr, value);
        }
      }

      return true;
    });
}
