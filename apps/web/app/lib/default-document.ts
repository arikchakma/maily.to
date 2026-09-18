import { migrate, requireContentMigration } from '@maily-to/migration';
import type { DocumentNode } from '@maily-to/shared';

import defaultEditorJSON from './default-editor-json.json';

export function getDefaultDocument(): DocumentNode {
  const json = defaultEditorJSON as Record<string, any>;

  return (
    requireContentMigration(json) ? migrate(json).json : json
  ) as DocumentNode;
}
