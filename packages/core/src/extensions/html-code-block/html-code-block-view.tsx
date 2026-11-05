import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import { HTML_CODE_BLOCK_TABS, MAILY_NODE_TYPES } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { SyntheticEvent } from 'react';
import { useMemo, useState } from 'react';

const PREVIEW_RESET = `
  html { overflow: hidden; }
  body { margin: 0; }
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

  // A sandbox without allow-scripts keeps the markup from running in the
  // editor's origin. allow-same-origin only lets the editor measure the height.
  const [height, setHeight] = useState(0);
  const onPreviewLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
    const frameWindow = event.currentTarget.contentWindow as
      | (Window & typeof globalThis)
      | null;
    const root = frameWindow?.document.documentElement;
    if (!frameWindow || !root) {
      return;
    }

    new frameWindow.ResizeObserver(() => {
      setHeight(root.offsetHeight);
    }).observe(root);
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
        >
          {!isEmpty && (
            <iframe
              onLoad={onPreviewLoad}
              sandbox="allow-same-origin"
              srcDoc={`<!DOCTYPE html><style>${PREVIEW_RESET}</style>${html}`}
              style={{
                border: 0,
                display: 'block',
                height,
                pointerEvents: 'none',
                width: '100%',
              }}
              title="HTML preview"
            />
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}
