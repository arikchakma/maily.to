import type { AnyExtension } from '@tiptap/core';

export function mergeExtensions(
  defaults: AnyExtension[],
  overrides: AnyExtension[]
): AnyExtension[] {
  const overrideNames = new Set(overrides.map((extension) => extension.name));
  const merged = defaults.filter(
    (extension) => !overrideNames.has(extension.name)
  );

  return [...merged, ...overrides];
}
