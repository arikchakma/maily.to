import { cn } from '@/editor/utils/classname';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useMemo } from 'react';
import { HtmlCodeBlockAttributes } from './html';

export function HTMLCodeBlockView(props: NodeViewProps) {
  const { node, updateAttributes } = props;

  let { language, activeTab = 'code' } = node.attrs as HtmlCodeBlockAttributes;
  activeTab ||= 'code';

  const languageClass = language ? `language-${language}` : '';

  const html = useMemo(() => {
    const text = node.content.content.reduce((acc, cur) => {
      if (cur.type.name === 'text') {
        return acc + cur.text;
      } else if (cur.type.name === 'variable') {
        const { id: variable, fallback } = cur?.attrs || {};
        const formattedVariable = fallback
          ? `{{${variable},fallback=${fallback}}}`
          : `{{${variable}}}`;
        return acc + formattedVariable;
      }

      return acc;
    }, '');

    const htmlParser = new DOMParser();
    const htmlDoc = htmlParser.parseFromString(text, 'text/html');

    // get styles from head
    const styles = Array.from(htmlDoc.head.getElementsByTagName('style'))
      .map((style) => style.outerHTML)
      .join('');

    // combine styles with body content
    return styles + htmlDoc.body.innerHTML;
  }, [activeTab]);

  const isEmpty = html === '';

  return (
    <NodeViewWrapper
      draggable={false}
      data-drag-handle={false}
      data-type="htmlCodeBlock"
    >
      {activeTab === 'code' && (
        <pre className="mly-my-0 mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-2 mly-text-black">
          <NodeViewContent
            as="code"
            className={cn('is-editable', languageClass)}
          />
        </pre>
      )}

      {activeTab === 'preview' && (
        <div
          className={cn(
            'mly-not-prose mly-rounded-lg mly-border mly-border-gray-200 mly-p-2',
            isEmpty && 'mly-min-h-[42px]'
          )}
          // shadow DOM to prevent styles from leaking
          ref={(node) => {
            if (node && !node.shadowRoot) {
              const shadow = node.attachShadow({ mode: 'open' });
              shadow.innerHTML = html;
            }
          }}
          contentEditable={false}
          onClick={() => {
            if (!isEmpty) {
              return;
            }

            updateAttributes({
              activeTab: 'code',
            });
          }}
        />
      )}
    </NodeViewWrapper>
  );
}
