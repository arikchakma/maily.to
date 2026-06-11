/**
 * Generates a unique identifier for a node.
 * Uses the Web Crypto API to produce a v4 UUID string,
 * e.g. "3b241101-e2bb-4d7a-8613-e4d4e2f1b9c1".
 */
export function uid(): string {
  return crypto.randomUUID();
}
