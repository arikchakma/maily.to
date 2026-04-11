import { render } from '@maily-to/render';
import { useMutation } from '@tanstack/react-query';
import type { Editor } from '@tiptap/core';
import { EyeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { EmailPreviewIFrame } from './email-preview-iframe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type PreviewEmailDialogProps = {
  subject?: string;
  previewText?: string;
  editor: Editor | null;
};

export function PreviewEmailDialog(props: PreviewEmailDialogProps) {
  const { subject = '', previewText = '', editor } = props;

  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const json = editor?.getJSON();
      if (!json) {
        throw new Error('No email content to preview');
      }

      const html = await render(json, {
        preview: previewText,
      });
      return html;
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to preview email');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex min-h-[28px] cursor-pointer items-center justify-center border border-black bg-black px-2 py-1 text-sm text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-7"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!editor) {
            toast.error('No email content to preview');
            return;
          }

          const html = await mutateAsync();
          setHtml(html);
          setOpen(true);
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
        <DialogContent className="z-99999 flex max-w-[620px] flex-col border-none bg-transparent p-0 shadow-none max-[680px]:h-full max-[680px]:border-0 max-[680px]:p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview Email</DialogTitle>
            <DialogDescription>
              Preview of the email that end users will receive
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-sm">
              AC
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-medium">Arik Chakma</h3>
              <h4 className="text-sm">{subject || 'Your Subject Goes Here'}</h4>
              <p className="text-sm text-gray-500">
                {previewText ||
                  'This is a preview text of your email, that will be shown in the inbox preview...'}
              </p>
            </div>
          </div>

          <div className="flex min-h-[75vh] w-full grow overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <EmailPreviewIFrame
              wrapperClassName="w-full"
              className="h-full w-full grow"
              innerHTML={html}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
