import { migrate } from '@maily-to/migration';
import type { JSONContent } from '@tiptap/react';

const DEFAULT_EDITOR_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

/**
 * Normalizes the initial content passed to the editor. Falls back
 * to a single empty paragraph when no content is provided.
 */
export function getInitialEditorContent(
  content?: string | JSONContent
): JSONContent | string {
  if (!content) {
    return migrate(DEFAULT_EDITOR_CONTENT).json;
  }

  if (typeof content === 'string') {
    return content;
  }

  return migrate(content).json;
}
