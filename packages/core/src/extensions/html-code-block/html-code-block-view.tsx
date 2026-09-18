import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import { HTML_CODE_BLOCK_TABS, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useMemo } from 'react';

const PREVIEW_RESET = `
  * { font-family: 'Inter', sans-serif; }
  blockquote, h1, h2, h3, img, li, ol, p, ul {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export function HtmlCodeBlockView(props: ReactNodeViewProps) {
  const { node, updateAttributes } = props;
  const { activeTab, language } = node.attrs as HtmlCodeBlockAttributes;

  /**
   * A `<style>` in the source belongs to the document head, so the preview
   * hoists every one of them above the body it renders.
   */
  const html = useMemo(() => {
    const source = node.content.content.reduce((text, child) => {
      if (child.type.name !== MAILY_NODE_TYPES.TEXT) {
        return text;
      }

      return text + child.text;
    }, '');

    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const styles = Array.from(parsed.querySelectorAll('style'))
      .map((element) => {
        return element.innerHTML;
      })
      .join('\n');

    return `<style>${styles}</style>${parsed.body.innerHTML}`;
  }, [node]);

  const isEmpty = html === '<style></style>';

  // The preview is a shadow root so the pasted markup cannot restyle the
  // editor around it, and the editor's own stylesheet cannot restyle the
  // preview.
  const setPreviewElement = (element: HTMLDivElement | null) => {
    if (!element || element.shadowRoot) {
      return;
    }

    const shadow = element.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(PREVIEW_RESET);
    shadow.adoptedStyleSheets = [sheet];

    const container = document.createElement('div');
    container.innerHTML = html;
    shadow.append(container);
  };

  return (
    <NodeViewWrapper data-drag-handle={false} draggable={false}>
      {activeTab === HTML_CODE_BLOCK_TABS.CODE && (
        <pre data-mly-html-code-block="">
          <NodeViewContent<'code'>
            as="code"
            className={language ? `language-${language}` : undefined}
          />
        </pre>
      )}

      {activeTab === HTML_CODE_BLOCK_TABS.PREVIEW && (
        <div
          contentEditable={false}
          data-empty={isEmpty ? '' : undefined}
          data-mly-html-code-block-preview=""
          onClick={() => {
            if (isEmpty) {
              updateAttributes({ activeTab: HTML_CODE_BLOCK_TABS.CODE });
            }
          }}
          ref={setPreviewElement}
        />
      )}
    </NodeViewWrapper>
  );
}
