import { useMutation } from '@tanstack/react-query';
import type { Editor } from '@tiptap/core';
import { ClipboardCheckIcon, ClipboardIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';
import { cn } from '~/lib/classname';
import { isSafari } from '~/lib/detect-browser';
import { httpPost } from '~/lib/http';

type CopyEmailHtmlProps = {
  previewText?: string;
  editor: Editor | null;
};

type PreviewEmailResponse = {
  html: string;
};

export function CopyEmailHtml(props: CopyEmailHtmlProps) {
  const { previewText = '', editor } = props;

  const [_, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const json = editor?.getJSON();
      return httpPost<PreviewEmailResponse>('/api/v1/emails/preview', {
        content: JSON.stringify(json),
        previewText,
      });
    },
  });

  return (
    <button
      className={cn(
        'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7',
        isCopied
          ? 'bg-green-200 text-green-600'
          : 'bg-black disabled:opacity-50'
      )}
      onClick={async (e) => {
        if (!editor) {
          toast.error('No email content to copy');
          return;
        }

        const data = await mutateAsync();

        if (isSafari()) {
          toast.custom(
            (t) => (
              <div className="rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm">
                Please{' '}
                <button
                  className="inline-flex items-center rounded-md bg-black px-1 text-white"
                  onClick={async () => {
                    toast.dismiss(t);
                    const success = await copy(data.html);
                    toast[success ? 'success' : 'error'](
                      success
                        ? 'Email HTML copied to clipboard'
                        : 'Failed to Copy'
                    );
                  }}
                >
                  <ClipboardIcon className="inline-block size-3 shrink-0" />
                  &nbsp;click here
                </button>{' '}
                to copy the email HTML to clipboard.{' '}
                <i>
                  (Safari does not support copying HTML directly from async
                  functions)
                </i>
              </div>
            ),
            {
              duration: 10000,
            }
          );
          return;
        }

        await copy(data.html);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }}
      disabled={isPending || isCopied}
    >
      {isPending ? (
        <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
      ) : (
        <>
          {isCopied ? (
            <ClipboardCheckIcon className="inline-block size-4 shrink-0 lg:mr-1" />
          ) : (
            <ClipboardIcon className="inline-block size-4 shrink-0 lg:mr-1" />
          )}
        </>
      )}

      <span className="hidden lg:inline-block">
        {isCopied ? 'Copied' : 'Copy HTML'}
      </span>
    </button>
  );
}
