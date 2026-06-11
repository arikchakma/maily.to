import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import {
  DEFAULT_HTML_CODE_BLOCK_TAB,
  HTML_CODE_BLOCK_TABS,
} from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useMemo } from 'react';

import { cn } from '~/utils/classname';

export function HtmlCodeBlockView(props: ReactNodeViewProps) {
  const { node, updateAttributes } = props;

  const { language, activeTab = DEFAULT_HTML_CODE_BLOCK_TAB } =
    node.attrs as HtmlCodeBlockAttributes;

  const languageClass = language ? `language-${language}` : '';

  const html = useMemo(() => {
    const text = node.content.content.reduce((acc, cur) => {
      if (cur.type.name === 'text') {
        return acc + cur.text;
      }

      return acc;
    }, '');

    const htmlParser = new DOMParser();
    const htmlDoc = htmlParser.parseFromString(text, 'text/html');
    const style = htmlDoc.querySelectorAll('style');
    const body = htmlDoc.body;
    const combinedStyle = Array.from(style)
      .map((s) => s.innerHTML)
      .join('\n');

    return `<style>${combinedStyle}</style>${body.innerHTML}`;
  }, [activeTab, node]);

  const isEmpty = html === '<style></style>';

  return (
    <NodeViewWrapper draggable={false} data-drag-handle={false}>
      {activeTab === HTML_CODE_BLOCK_TABS.CODE && (
        <pre className="mly:my-0 mly:overflow-x-auto mly:rounded-lg mly:border mly:border-soft-gray mly:bg-white mly:p-2 mly:text-sm mly:text-black">
          <NodeViewContent<'code'>
            as="code"
            className={cn('is-editable', languageClass)}
          />
        </pre>
      )}

      {activeTab === HTML_CODE_BLOCK_TABS.PREVIEW && (
        <div
          className={cn(
            'mly:not-prose mly:rounded-lg mly:border mly:border-soft-gray mly:p-2',
            isEmpty && 'mly:min-h-9.5'
          )}
          ref={(node) => {
            if (!node || node?.shadowRoot) {
              return;
            }
            const shadow = node.attachShadow({ mode: 'open' });
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(`
              * { font-family: 'Inter', sans-serif; }
              blockquote, h1, h2, h3, img, li, ol, p, ul {
                margin-top: 0;
                margin-bottom: 0;
              }
            `);
            shadow.adoptedStyleSheets = [sheet];
            const container = document.createElement('div');
            container.innerHTML = html;
            shadow.appendChild(container);
          }}
          contentEditable={false}
          onClick={() => {
            if (!isEmpty) {
              return;
            }

            updateAttributes({
              activeTab: HTML_CODE_BLOCK_TABS.CODE,
            });
          }}
        />
      )}
    </NodeViewWrapper>
  );
}
