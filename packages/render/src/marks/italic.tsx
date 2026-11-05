import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

export const italic: MarkRenderer = (mark, text) => {
  return <em style={getNodeStyle(mark.attrs?.style)}>{text}</em>;
};
