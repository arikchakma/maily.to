import type { MarkRenderer } from '../mark';

export const italic: MarkRenderer = (_mark, text, _ctx) => {
  return <em>{text}</em>;
};
