import { cn } from '@/editor/utils/classname';
import { updateAttributes } from '@/editor/utils/update-attribute';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextSelection } from '@tiptap/pm/state';
import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import html from 'highlight.js/lib/languages/xml';
import { createLowlight, common } from 'lowlight';
import { useMemo } from 'react';

const lowlight = createLowlight(common);
lowlight.register('html', html);

type HtmlCodeBlockAttributes = {
  activeTab: string;
  showIfKey: string;
  language: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    htmlCodeBlock: {
      /**
       * Set a code block
       * @param attributes Code block attributes
       * @example editor.commands.setCodeBlock({ language: 'javascript' })
       */
      setHtmlCodeBlock: (attributes?: { language: string }) => ReturnType;
      /**
       * Toggle a code block
       * @param attributes Code block attributes
       * @example editor.commands.toggleCodeBlock({ language: 'javascript' })
       */
      toggleHtmlCodeBlock: (attributes?: { language: string }) => ReturnType;
      updateHtmlCodeBlock: (
        attrs: Partial<HtmlCodeBlockAttributes>
      ) => ReturnType;
    };
  }
}

export const HTMLCodeBlock = CodeBlockLowlight.extend({
  name: 'htmlCodeBlock',

  addAttributes() {
    return {
      ...this.parent?.(),
      activeTab: 'code',
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HTMLCodeBlockView, {
      className: 'mly-relative',
    });
  },

  addCommands() {
    return {
      setHtmlCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleHtmlCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
      updateHtmlCodeBlock: (attrs) => updateAttributes(this.name, attrs),
    };
  },
  
}).configure({
  lowlight,
});

function HTMLCodeBlockView(props: NodeViewProps) {
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
