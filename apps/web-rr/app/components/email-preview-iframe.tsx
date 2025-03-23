import { useEffect, type RefObject, useRef } from 'react';
import { MailOpenIcon } from 'lucide-react';
import { toast } from 'sonner';
import { isSafari } from '~/lib/detect-browser';
import { cn } from '~/lib/classname';
import { Button } from './ui/button';

type EmailPreviewIFrameProps = {
  innerHTML: string;
  isServer?: boolean;
  showOpenInNewTab?: boolean;
  wrapperClassName?: string;
} & React.HTMLProps<HTMLIFrameElement>;

function renderHTMLToIFrame(
  ref: RefObject<HTMLIFrameElement | null>,
  html: string
) {
  if (!ref || !ref?.current) {
    return;
  }

  const iframeDocument = ref.current.contentDocument;
  if (!iframeDocument) {
    return;
  }

  const fontLink = iframeDocument.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  iframeDocument.head.appendChild(fontLink);
  iframeDocument.body.innerHTML = html;
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
    if (!isSafari() || !iframeRef.current || isServer) {
      return;
    }

    renderHTMLToIFrame(iframeRef, innerHTML);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isServer doesn't matter
  }, [innerHTML]);

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
        {...defaultProps}
        onLoad={() => {
          if (isSafari() || isServer) {
            return;
          }

          renderHTMLToIFrame(iframeRef, innerHTML);
        }}
        ref={iframeRef}
        srcDoc={isServer ? innerHTML : ''}
      />

      {showOpenInNewTab ? (
        <Button
          className="absolute bottom-0 right-0 h-8 gap-1.5 rounded-none rounded-tl-md border-l border-t text-sm font-normal hover:bg-gray-50"
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
