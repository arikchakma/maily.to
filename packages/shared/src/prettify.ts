/**
 * Utility type that flattens an intersection into a single object type.
 * Improves IDE hover display by expanding `A & B` into `{ ...all keys }`.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
