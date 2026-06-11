import type { MarkRenderer } from '../mark';

export const bold: MarkRenderer = (_mark, text, _ctx) => {
  return <strong>{text}</strong>;
};
