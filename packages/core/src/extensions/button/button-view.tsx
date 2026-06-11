import {
  BUTTON_KINDS,
  getBorderStyle,
  getFontStyle,
  isDef,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

import { cn } from '~/utils/classname';

import type { ButtonAttributes } from './button';

const ALIGNMENT_TO_JUSTIFY_CONTENT = {
  [TEXT_ALIGNMENTS.LEFT]: 'flex-start',
  [TEXT_ALIGNMENTS.CENTER]: 'center',
  [TEXT_ALIGNMENTS.RIGHT]: 'flex-end',
} as const;

export function ButtonView(props: ReactNodeViewProps) {
  const { node } = props;
  const attrs = node.attrs as ButtonAttributes;
  const {
    dir,
    kind,
    alignment,
    backgroundColor,
    color,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = attrs;
  const borderStyle = getBorderStyle(attrs);
  const fontStyle = getFontStyle(attrs);

  const isFullWidth = kind === BUTTON_KINDS.FULL_WIDTH;

  return (
    <NodeViewWrapper
      style={{ textAlign: alignment ?? undefined }}
      dir={dir ?? undefined}
    >
      <NodeViewContent
        className={cn(
          'mly:selection:bg-(--mly-selection-background-color)',
          isFullWidth
            ? 'mly:flex mly:first:flex'
            : 'mly:inline-flex mly:first:inline-flex'
        )}
        dir={dir ?? undefined}
        style={{
          ...(color
            ? {
                '--mly-selection-background-color': `color-mix(in srgb, ${color} 35%, transparent)`,
              }
            : {}),
          backgroundColor:
            backgroundColor || 'var(--mly-button-background-color)',
          color: color || 'var(--mly-button-text-color)',
          paddingTop: isDef(paddingTop)
            ? `${paddingTop}px`
            : 'var(--mly-button-padding-top)',
          paddingRight: isDef(paddingRight)
            ? `${paddingRight}px`
            : 'var(--mly-button-padding-right)',
          paddingBottom: isDef(paddingBottom)
            ? `${paddingBottom}px`
            : 'var(--mly-button-padding-bottom)',
          paddingLeft: isDef(paddingLeft)
            ? `${paddingLeft}px`
            : 'var(--mly-button-padding-left)',
          ...(isFullWidth
            ? {
                width: '100%',
                justifyContent:
                  ALIGNMENT_TO_JUSTIFY_CONTENT[
                    alignment ?? TEXT_ALIGNMENTS.CENTER
                  ],
              }
            : {}),
          ...borderStyle,
          ...fontStyle,
        }}
      />
    </NodeViewWrapper>
  );
}
