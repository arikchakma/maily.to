import type { MarkRenderer } from '../mark';

export const underline: MarkRenderer = (_mark, text, _ctx) => {
  return <u>{text}</u>;
};
