import { ANTIALIASED } from '../lib/styles';
import type { MarkRenderer } from '../mark';

const CODE_FONT_FAMILY = 'ui-monospace, monospace';

export const code: MarkRenderer = (_mark, text, ctx) => {
  const theme = ctx.config.theme;

  return (
    <code
      style={{
        backgroundColor: theme.code?.backgroundColor,
        color: theme.code?.color,
        fontFamily: CODE_FONT_FAMILY,
        fontSize: '85%',
        padding: '2px 6px',
        borderRadius: 8,
        ...ANTIALIASED,
      }}
    >
      {text}
    </code>
  );
};
