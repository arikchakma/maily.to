import type { MarkRenderer } from '../mark';

export const strike: MarkRenderer = (_mark, text, _ctx) => {
  return <s>{text}</s>;
};
