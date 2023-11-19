'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { isSafari } from '@/utils/detect-browser';

function renderHTMLToIFrame(ref: RefObject<HTMLIFrameElement>, html: string) {
  if (!ref.current) {
    return;
  }
  const iframeDocument = ref.current.contentDocument;

  if (!iframeDocument) {
    return;
  }
  iframeDocument.body.style.padding = '20px 0';
  const fontLink = iframeDocument.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  iframeDocument.head.appendChild(fontLink);

  iframeDocument.body.innerHTML = html;
}

export function IFrame({
  innerHTML,
  ...props
}: {
  innerHTML: string;
} & React.HTMLProps<HTMLIFrameElement>) {
  const contentRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isSafari()) {
      return;
    }

    renderHTMLToIFrame(contentRef, innerHTML);
  }, [innerHTML]);

  return (
    <iframe
      title="Email Preview"
      {...props}
      onLoad={() => {
        if (isSafari()) {
          return;
        }

        renderHTMLToIFrame(contentRef, innerHTML);
      }}
      ref={contentRef}
    />
  );
}
