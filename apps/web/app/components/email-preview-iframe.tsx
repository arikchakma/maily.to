import { MailOpenIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { toast } from 'sonner';

import { cn } from '~/lib/classname';

import { Button } from './ui/button';

type EmailPreviewIFrameProps = {
  innerHTML: string;
  isServer?: boolean;
  showOpenInNewTab?: boolean;
  wrapperClassName?: string;
} & React.HTMLProps<HTMLIFrameElement>;

type RenderHTMLToIFrameOptions = {
  html: string;
  ref: RefObject<HTMLIFrameElement | null>;
};

function renderHTMLToIFrame(options: RenderHTMLToIFrameOptions) {
  const { html, ref } = options;

  if (!ref || !ref?.current) {
    return;
  }

  const doc = ref.current.contentDocument;
  if (!doc) {
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>@font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; font-display: swap; src: url('/fonts/inter.woff2') format('woff2'); }</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
  doc.close();
}

export function EmailPreviewIFrame(props: EmailPreviewIFrameProps) {
  const {
    innerHTML,
    isServer,
    showOpenInNewTab = true,
    wrapperClassName,
    ...defaultProps
  } = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || isServer) {
      return;
    }

    renderHTMLToIFrame({ html: innerHTML, ref: iframeRef });
  }, [innerHTML, isServer]);

  function handleOpen() {
    if (innerHTML.trim().length === 0) {
      toast.error('There is no data to preview.');
      return;
    }

    const newWindow = window.open('about:blank', '_blank');
    newWindow?.focus();

    const newDoc = newWindow?.document;
    if (!newDoc) {
      toast.error('Something went wrong.');
      return;
    }

    newDoc.open();
    newDoc.write(innerHTML);
    newDoc.close();
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      <iframe
        title="Email preview"
        sandbox="allow-same-origin"
        {...defaultProps}
        onLoad={() => {
          if (isServer) {
            return;
          }

          renderHTMLToIFrame({ html: innerHTML, ref: iframeRef });
        }}
        ref={iframeRef}
        srcDoc={isServer ? innerHTML : ''}
      />

      {showOpenInNewTab ? (
        <Button
          className="absolute right-0 bottom-0 h-8 cursor-pointer gap-1.5 rounded-none rounded-tl-md border-t border-l border-gray-200 text-sm font-normal hover:bg-gray-50"
          onClick={handleOpen}
          type="button"
          variant="secondary"
        >
          <MailOpenIcon className="h-3.5 w-3.5 shrink-0" />
          <span>Open in new tab</span>
        </Button>
      ) : null}
    </div>
  );
}
