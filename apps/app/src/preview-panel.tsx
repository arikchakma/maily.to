import { useCallback, useEffect, useMemo, useState } from 'react';

import { JsonEditor } from './json-editor';
import { Nav } from './nav';
import { cn } from './utils/classname';

const TABS = ['HTML', 'React', 'JSON', 'Preview'] as const;
type Tab = (typeof TABS)[number];

type PreviewViewport = 'desktop' | 'mobile';

type PreviewPanelProps = {
  html: string;
  json: string;
  jsx: string;
  rawHtml: string;
};

type CopyButtonProps = {
  html: string;
};

function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const div = window.document.createElement('div');
    div.innerHTML = props.html;
    void navigator.clipboard.writeText(div.textContent ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [props.html]);

  return (
    <Nav.Button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Nav.Button>
  );
}

export function PreviewPanel(props: PreviewPanelProps) {
  const { html, json, jsx, rawHtml } = props;
  const [activeTab, setActiveTab] = useState<Tab>('Preview');
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [iframeHeight, setIframeHeight] = useState(0);

  const srcDoc = useMemo(() => {
    if (!rawHtml) {
      return '';
    }

    const script = /*html*/ `<script>
      function sendHeight() {
        var rect = document.body.getBoundingClientRect();
        var style = getComputedStyle(document.body);
        var h = rect.height + parseInt(style.marginTop) + parseInt(style.marginBottom);
        window.parent.postMessage({ type: 'preview-resize', height: h }, '*');
      }
      window.addEventListener('load', function() {
        sendHeight();
        new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true });
      });
    </script>`;

    return rawHtml + script;
  }, [rawHtml]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'preview-resize') {
        setIframeHeight(event.data.height);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      console.error('Failed to open new tab');
      return;
    }

    newWindow.document.write(rawHtml);
    newWindow.document.close();
  }, [rawHtml]);

  return (
    <div className="fixed top-0 right-0 z-20 flex h-screen w-1/2 flex-col border-l border-gray-200">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              className={cn(
                'border-r border-gray-200 px-4 py-2 font-mono text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pr-2">
          {activeTab === 'Preview' ? (
            <div className="flex items-center gap-0.5">
              {(['mobile', 'desktop'] as const).map((option) => (
                <button
                  aria-pressed={viewport === option}
                  className={cn(
                    'h-6 rounded-md px-2 font-mono text-xs capitalize transition-colors',
                    viewport === option
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                  )}
                  key={option}
                  onClick={() => setViewport(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <CopyButton
              html={
                activeTab === 'JSON' ? json : activeTab === 'HTML' ? html : jsx
              }
            />
          )}
          <Nav.Button onClick={handleOpenInNewTab}>New tab ↗</Nav.Button>
        </div>
      </div>

      <div className="hide-scrollbar min-h-0 min-w-0 flex-1 overflow-auto bg-white">
        {activeTab === 'Preview' && rawHtml && (
          <iframe
            className="mx-auto border-0"
            key={rawHtml}
            srcDoc={srcDoc}
            style={{
              width: viewport === 'mobile' ? '390px' : '100%',
              height: iframeHeight > 0 ? `${iframeHeight}px` : '100%',
            }}
            title="Rendered email preview"
          />
        )}
        {activeTab === 'HTML' && (
          <div className="p-4" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        {activeTab === 'React' && (
          <div className="p-4" dangerouslySetInnerHTML={{ __html: jsx }} />
        )}
        {activeTab === 'JSON' && <JsonEditor readOnly value={json} />}
      </div>
    </div>
  );
}
