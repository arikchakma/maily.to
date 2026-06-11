import { useCallback, useEffect, useMemo, useState } from 'react';

import { JsonEditor } from './json-editor';

const TABS = ['HTML', 'React', 'JSON', 'Preview'] as const;
type Tab = (typeof TABS)[number];

const PREVIEW_VIEWPORTS = { mobile: 350, desktop: 600 } as const;
type PreviewViewport = keyof typeof PREVIEW_VIEWPORTS;

type ReactEmailPreviewProps = {
  jsx: string;
  html: string;
  rawHtml: string;
  json: string;
};

type CopyButtonProps = { html: string };

function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const div = document.createElement('div');
    div.innerHTML = props.html;
    void navigator.clipboard.writeText(div.textContent ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [props.html]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-gray-600 transition-colors hover:bg-gray-300"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export function ReactEmailPreview(props: ReactEmailPreviewProps) {
  const { jsx, html, rawHtml, json } = props;
  const [activeTab, setActiveTab] = useState<Tab>('HTML');
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
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-r border-gray-200 px-4 py-2 font-mono text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'Preview' ? (
          <div className="flex items-center gap-1 pr-2">
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                viewport === 'mobile'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                viewport === 'desktop'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Desktop
            </button>
            <span className="mx-1 text-gray-300">·</span>
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-gray-600 transition-colors hover:bg-gray-300"
            >
              New tab ↗
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 pr-2">
            <CopyButton
              html={
                activeTab === 'JSON' ? json : activeTab === 'HTML' ? html : jsx
              }
            />
            <span className="mx-1 text-gray-300">·</span>
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="rounded bg-gray-200 px-2 py-0.5 font-mono text-xs text-gray-600 transition-colors hover:bg-gray-300"
            >
              New tab ↗
            </button>
          </div>
        )}
      </div>

      <div className="hide-scrollbar min-h-0 min-w-0 flex-1 overflow-auto">
        {activeTab === 'Preview' && rawHtml && (
          <iframe
            key={rawHtml}
            title="Email Preview"
            srcDoc={srcDoc}
            style={{
              width: viewport === 'mobile' ? '390px' : '100%',
              height: iframeHeight > 0 ? `${iframeHeight}px` : '100%',
            }}
            className="mx-auto border-0"
          />
        )}
        {activeTab === 'HTML' && (
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
        {activeTab === 'React' && (
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: jsx }} />
          </div>
        )}
        {activeTab === 'JSON' && <JsonEditor value={json} readOnly />}
      </div>
    </div>
  );
}
