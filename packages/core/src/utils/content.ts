import type { DocumentNode } from '@maily-to/shared';
import { generateJSON } from '@tiptap/core';

import { DEFAULT_EXTENSIONS } from '~/hooks/use-maily-editor';
import { getNormalizedHtml } from '~/utils/html';

export function getContentFromHtml(html: string) {
  return generateJSON(
    getNormalizedHtml(html),
    DEFAULT_EXTENSIONS
  ) as DocumentNode;
}
