import type { Transaction } from '@tiptap/pm/state';

// The y-sync plugin tags the transactions it applies from a Y.Doc. The key
// matches `isChangeOrigin` from `@tiptap/extension-collaboration`, so core
// does not need that package at runtime.
const Y_SYNC_META_KEY = 'y-sync$';

export function isRemoteChange(tr: Transaction) {
  return Boolean(tr.getMeta(Y_SYNC_META_KEY));
}
