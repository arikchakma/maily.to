import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { httpPost } from '~/lib/http';
import type { Editor } from '@tiptap/core';
import { useState } from 'react';
import {
  CodeIcon,
  Loader2Icon,
  ClipboardIcon,
  ClipboardCheckIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';

type ViewEmailHtmlProps = {
  previewText?: string;
  editor: Editor | null;
};

type PreviewEmailResponse = {
  html: string;
};

export function ViewEmailHtml(props: ViewEmailHtmlProps) {
  const { previewText = '', editor } = props;

  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const json = editor?.getJSON();
      return httpPost<PreviewEmailResponse>('/api/v1/emails/preview', {
        content: JSON.stringify(json),
        previewText,
      });
    },
    onSuccess: (data) => {
      setHtml(data?.html);
      setOpen(true);
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to generate HTML');
    },
  });

  const handleCopy = async () => {
    const success = await copy(html);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error('Failed to copy HTML');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-7"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!editor) {
            toast.error('No email content to view');
            return;
          }

          setHtml('');
          mutate();
        }}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
        ) : (
          <CodeIcon className="inline-block size-4 shrink-0 lg:mr-1" />
        )}
        <span className="hidden lg:inline-block">View HTML</span>
      </DialogTrigger>

      {open && (
        <DialogContent className="z-[99999] flex max-h-[85vh] max-w-4xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Email HTML Source</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-normal hover:bg-gray-200"
              >
                {isCopied ? (
                  <>
                    <ClipboardCheckIcon className="size-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="size-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </DialogTitle>
            <DialogDescription>
              Raw HTML output that can be used in your email service
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50">
            <pre className="p-4 text-xs leading-relaxed">
              <code className="whitespace-pre-wrap break-all text-gray-800">
                {html}
              </code>
            </pre>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
