import type {
  AnyMailyMark,
  AnyMailyNode,
  MailyMarkType,
} from '@maily-to/shared';
import { is, MAILY_MARK_TYPES } from '@maily-to/shared';

import type { RenderContext } from './context';
import { getNodeStyle } from './lib/styles';
import { bold } from './marks/bold';
import { code } from './marks/code';
import { italic } from './marks/italic';
import { link } from './marks/link';
import { strike } from './marks/strike';
import { underline } from './marks/underline';

const MAILY_MARKS_ORDER = [
  MAILY_MARK_TYPES.UNDERLINE,
  MAILY_MARK_TYPES.BOLD,
  MAILY_MARK_TYPES.ITALIC,
  MAILY_MARK_TYPES.STRIKE,
  MAILY_MARK_TYPES.LINK,
  MAILY_MARK_TYPES.CODE,
];

export type MarkRenderer = (
  mark: AnyMailyMark,
  text: React.ReactNode,
  ctx: RenderContext
) => React.ReactNode;

const MAILY_MARK_RENDERERS: Partial<Record<MailyMarkType, MarkRenderer>> = {
  [MAILY_MARK_TYPES.UNDERLINE]: underline,
  [MAILY_MARK_TYPES.BOLD]: bold,
  [MAILY_MARK_TYPES.ITALIC]: italic,
  [MAILY_MARK_TYPES.STRIKE]: strike,
  [MAILY_MARK_TYPES.LINK]: link,
  [MAILY_MARK_TYPES.CODE]: code,
};

function render(mark: AnyMailyMark, text: React.ReactNode, ctx: RenderContext) {
  if (!is.mark(mark)) {
    return null;
  }

  const renderer = MAILY_MARK_RENDERERS[mark.type];
  if (!renderer) {
    return null;
  }

  return renderer(mark, text, ctx);
}

type MergedTextStyle = Record<string, string | undefined> & {
  backgroundColor?: string;
  color?: string;
};

export function marks(node: AnyMailyNode, ctx: RenderContext) {
  if (!is.marked(node)) {
    return [];
  }

  // Merge text styles so that we don't have to add a span for each of them.
  const textStyles = node.marks
    .filter((mark) => is.textStyle(mark) || is.highlight(mark) || is.span(mark))
    .reduce((acc, mark) => {
      if (is.textStyle(mark)) {
        if (mark.attrs.color) {
          acc.color = mark.attrs.color;
        }
      } else if (is.highlight(mark)) {
        acc.backgroundColor = mark.attrs.color;
      } else {
        Object.assign(acc, getNodeStyle(mark.attrs?.style));
      }

      return acc;
    }, {} as MergedTextStyle);

  const marks = node.marks
    .filter(
      (mark) => !is.textStyle(mark) && !is.highlight(mark) && !is.span(mark)
    )
    .sort(
      (a, b) =>
        MAILY_MARKS_ORDER.indexOf(a.type) - MAILY_MARKS_ORDER.indexOf(b.type)
    );

  const text = node?.text || <>&nbsp;</>;
  const baseText = isEmptyObject(textStyles) ? (
    <>{text}</>
  ) : (
    <span style={textStyles}>{text}</span>
  );

  return marks.reduce(
    (acc: React.ReactNode, mark: AnyMailyMark, index: number) => {
      const component = render(
        mark,
        acc,
        ctx.child({ parent: node, siblingIndex: index })
      );
      if (!component) {
        return acc;
      }

      return component;
    },
    baseText
  );
}

function isEmptyObject<T extends object>(obj: T): boolean {
  for (const _ in obj) {
    return false;
  }

  return true;
}
