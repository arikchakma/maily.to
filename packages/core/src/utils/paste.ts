import { isNodeEmpty } from '@tiptap/core';
import { closeHistory } from '@tiptap/pm/history';
import { DOMParser, Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';

import { getNormalizedHtml } from './html';

type PasteHtmlSourceOptions = {
  event: ClipboardEvent;
  view: EditorView;
};

function isPlainPaste(view: EditorView) {
  const { input } = view as unknown as { input?: { shiftKey?: boolean } };

  return (
    Boolean(input?.shiftKey) ||
    Boolean(view.state.selection.$from.parent.type.spec.code)
  );
}

function isHtmlSource(text: string) {
  return text.startsWith('<') && text.endsWith('>');
}

export function pasteHtmlSource(options: PasteHtmlSourceOptions) {
  const { event, view } = options;
  const text = event.clipboardData?.getData('text/plain')?.trim() ?? '';

  if (
    event.clipboardData?.getData('text/html') ||
    isPlainPaste(view) ||
    !isHtmlSource(text)
  ) {
    return false;
  }

  // A document parse, not a slice: body and container exist only at the top.
  const element = document.createElement('div');
  element.innerHTML = getNormalizedHtml(text);
  const parsed = DOMParser.fromSchema(view.state.schema).parse(element);
  const container = parsed.firstChild?.firstChild;

  if (!container?.content.size) {
    return false;
  }

  const wasEmpty = isNodeEmpty(view.state.doc);
  const from = view.state.selection.from;
  view.dispatch(view.state.tr.insertText(text).setMeta('paste', true));

  // Its own history event, so one undo leaves the markup behind as text.
  const converted = closeHistory(view.state.tr);
  const to = view.state.selection.from;

  if (wasEmpty) {
    converted.replaceWith(0, view.state.doc.content.size, parsed.content);
  } else {
    converted.replaceRange(from, to, Slice.maxOpen(container.content));
  }

  view.dispatch(converted.setMeta('paste', true));

  return true;
}
