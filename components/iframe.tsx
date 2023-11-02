'use client';

import { useEffect, useRef } from 'react';

export const IFrame = ({
  innerHTML,
  ...props
}: {
  innerHTML: string;
} & React.HTMLProps<HTMLIFrameElement>) => {
  const contentRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!contentRef.current) {
        return;
      }
      const iframeDocument = contentRef.current.contentDocument;

      if (!iframeDocument) {
        return;
      }
      iframeDocument.body.style.padding = '20px 0';
      const fontLink = iframeDocument.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      iframeDocument.head.appendChild(fontLink);

      iframeDocument.body.innerHTML = innerHTML;
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [innerHTML]);

  return <iframe {...props} ref={contentRef} />;
};
