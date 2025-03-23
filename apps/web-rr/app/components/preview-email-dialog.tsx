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
import { EmailPreviewIFrame } from './email-preview-iframe';
import { EyeIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

type PreviewEmailDialogProps = {
  previewText?: string;
  editor: Editor | null;
};

type PreviewEmailResponse = {
  html: string;
};

export function PreviewEmailDialog(props: PreviewEmailDialogProps) {
  const { previewText = '', editor } = props;

  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState('');

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
      toast.error(error?.message || 'Failed to preview email');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-7"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!editor) {
            toast.error('No email content to preview');
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
          <EyeIcon className="inline-block size-4 shrink-0 lg:mr-1" />
        )}
        <span className="hidden lg:inline-block">Preview Email</span>
      </DialogTrigger>

      {open && (
        <DialogContent className="z-[99999] min-h-[75vh] w-full min-w-0 max-w-[620px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:border-0 max-[680px]:shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview Email</DialogTitle>
            <DialogDescription>
              Preview of the email that end users will receive
            </DialogDescription>
          </DialogHeader>

          <EmailPreviewIFrame className="h-full w-full" innerHTML={html} />
        </DialogContent>
      )}
    </Dialog>
  );
}
