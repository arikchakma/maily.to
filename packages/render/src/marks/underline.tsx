import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

export const underline: MarkRenderer = (mark, text) => {
  return <u style={getNodeStyle(mark.attrs?.style)}>{text}</u>;
};
