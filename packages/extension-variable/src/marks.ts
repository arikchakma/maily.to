import type { Attrs } from '@tiptap/pm/model';
import type { EditorState } from '@tiptap/pm/state';

export type SerializedMark = {
  attrs: Attrs;
  type: string;
};

export type MarksAtOptions = {
  pos: number;
  state: EditorState;
};

export function getMarksAt(options: MarksAtOptions): SerializedMark[] {
  const { pos, state } = options;
  const marks = state.storedMarks ?? state.doc.resolve(pos).marks();

  return marks.map((mark) => {
    return { attrs: mark.attrs, type: mark.type.name };
  });
}
