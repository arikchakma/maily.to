'use client';

import { useEffect, useRef, useState } from 'react';

export const IFrame = ({
  innerHTML,
  ...props
}: {
  innerHTML: string;
} & React.HTMLProps<HTMLIFrameElement>) => {
  const contentRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    const iframe = contentRef.current;
    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) {
      return;
    }
    iframeDocument.body.innerHTML = innerHTML;
    iframeDocument.body.style.padding = '20px 0';

    const unmount = () => {
      iframeDocument.body.innerHTML = '';
    };

    return unmount;
  }, [innerHTML]);

  return <iframe {...props} ref={contentRef} />;
};
