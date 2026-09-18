import { ANTIALIASED, getNodeStyle } from '../lib/styles';
import type { MarkRenderer } from '../mark';

export const code: MarkRenderer = (mark, text) => {
  return (
    <code
      style={{
        ...ANTIALIASED,
        ...getNodeStyle(mark.attrs?.style),
      }}
    >
      {text}
    </code>
  );
};
