import type { AnyExtension } from '@tiptap/core';

/**
 * Replaces default Tiptap extensions with user overrides by name.
 * Extensions in `overrides` replace any default with the same name;
 * the rest of the defaults are kept.
 */
export function mergeExtensions(
  defaults: AnyExtension[],
  overrides: AnyExtension[]
): AnyExtension[] {
  const overrideNames = new Set(overrides.map((ext) => ext.name));
  const merged = defaults.filter((ext) => !overrideNames.has(ext.name));
  return [...merged, ...overrides];
}
