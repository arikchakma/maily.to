'use client';

import { RefObject, useEffect, useRef } from 'react';

import { isFirefox, isSafari } from '@/utils/detect-browser';

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

export const IFrame = ({
  innerHTML,
  ...props
}: {
  innerHTML: string;
} & React.HTMLProps<HTMLIFrameElement>) => {
  const contentRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isSafari()) {
      return;
    }

    renderHTMLToIFrame(contentRef, innerHTML);
  }, [innerHTML]);

  return (
    <iframe
      {...props}
      ref={contentRef}
      onLoad={() => {
        if (isSafari()) {
          return;
        }

        renderHTMLToIFrame(contentRef, innerHTML);
      }}
    />
  );
};
