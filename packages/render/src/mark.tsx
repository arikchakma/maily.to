import type {
  AnyMailyMark,
  AnyMailyNode,
  MailyMarkType,
} from '@maily-to/shared';
import { is, MAILY_MARK_TYPES } from '@maily-to/shared';

import type { RenderContext } from './context';
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

/**
 * Function signature for a mark renderer. Each mark type (bold, link,
 * etc.) wraps the text node in its styled element.
 */
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

type MergedTextStyle = {
  color?: string;
  backgroundColor?: string;
};

/**
 * Applies all marks on a text node. Merges textStyle and highlight
 * marks into a single span, then wraps with remaining marks in order.
 */
export function marks(node: AnyMailyNode, ctx: RenderContext) {
  if (!is.marked(node)) {
    return [];
  }

  const themeColor = ctx.config.theme.paragraph?.color;

  // Merge text styles so that we don't have to add multiple spans for each text style
  // This is done by reducing the marks to a single object with the text styles
  const textStyles = node.marks
    .filter((mark) => is.textStyle(mark) || is.highlight(mark))
    .reduce((acc, mark) => {
      if (is.textStyle(mark)) {
        acc.color = mark.attrs.color || themeColor;
      } else {
        acc.backgroundColor = mark.attrs.color;
      }

      return acc;
    }, {} as MergedTextStyle);

  const marks = node.marks
    .filter((mark) => !is.textStyle(mark) && !is.highlight(mark))
    .sort((a, b) => {
      const aIndex = MAILY_MARKS_ORDER.indexOf(a.type);
      const bIndex = MAILY_MARKS_ORDER.indexOf(b.type);
      return aIndex - bIndex;
    });

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
