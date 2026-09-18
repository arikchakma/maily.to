import { getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

export const strike: MarkRenderer = (mark, text) => {
  return <s style={getNodeStyle(mark.attrs?.style)}>{text}</s>;
};
