import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

export const bold: MarkRenderer = (mark, text) => {
  return <strong style={getNodeStyle(mark.attrs?.style)}>{text}</strong>;
};
