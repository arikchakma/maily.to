function isMergableObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * One-level deep merge of plain objects. Nested plain objects are
 * shallow-merged; primitives, arrays, and null are replaced outright.
 * Does not mutate the target — returns a new object.
 *
 * Example:
 *   deepMerge({ a: 1, nested: { x: 1, y: 2 } }, { nested: { y: 3 } })
 *   // => { a: 1, nested: { x: 1, y: 3 } }
 */
export function deepMerge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  const result: Record<string, unknown> = { ...target } as Record<
    string,
    unknown
  >;

  for (const source of sources) {
    for (const [key, value] of Object.entries(source as object)) {
      result[key] =
        isMergableObject(value) && isMergableObject(result[key])
          ? { ...result[key], ...value }
          : value;
    }
  }

  return result as T;
}

export function isObjectDeepEqual(first: object, second: object): boolean {
  if (first === second) {
    return true;
  }

  for (const key of Object.keys(first) as Array<keyof typeof first>) {
    if (first[key] !== (second as typeof first)[key]) {
      return false;
    }
  }

  return true;
}
