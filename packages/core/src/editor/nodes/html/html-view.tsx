import { cn } from '@/editor/utils/classname';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useMemo } from 'react';
import { HtmlCodeBlockAttributes } from './html';

export function HTMLCodeBlockView(props: NodeViewProps) {
  const { node } = props;

  let { language, activeTab = 'code' } = node.attrs as HtmlCodeBlockAttributes;
  activeTab ||= 'code';

  const languageClass = language ? `language-${language}` : '';

  const html = useMemo(() => {
    const text = node.content.content.reduce((acc, cur) => {
      return acc + cur.text;
    }, '');

    const htmlParser = new DOMParser();
    const htmlDoc = htmlParser.parseFromString(text, 'text/html');
    const body = htmlDoc.body;
    return body.innerHTML;
  }, [activeTab]);

  return (
    <NodeViewWrapper
      draggable={false}
      data-drag-handle={false}
      data-type="htmlCodeBlock"
    >
      {activeTab === 'code' && (
        <pre className="mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-2 mly-text-black">
          <NodeViewContent
            as="code"
            className={cn('is-editable', languageClass)}
          />
        </pre>
      )}

      {activeTab === 'preview' && (
        <div
          className="mly-not-prose mly-rounded-lg mly-border mly-border-gray-200 mly-p-2"
          dangerouslySetInnerHTML={{ __html: html }}
          contentEditable={false}
        />
      )}
    </NodeViewWrapper>
  );
}
