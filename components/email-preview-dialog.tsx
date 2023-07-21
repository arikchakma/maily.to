'use client';

import { useState } from 'react';
import { EyeIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { MailEditor } from './editor';
import { tiptapToHtml } from './editor/utils/email';
import { IFrame } from './iframe';

type EmailPreviewDialogProps = {
  editor: MailEditor;
};

export function EmailPreviewDialog(props: EmailPreviewDialogProps) {
  const [html, setHtml] = useState('');
  const { editor } = props;
  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => {
          setHtml(tiptapToHtml(editor.getEditor().getJSON().content || []));
        }}
      >
        <button className="flex grow items-center justify-center gap-2 rounded-md border-4 border-black bg-white px-5 py-3 text-xl font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0">
          <EyeIcon size={24} />
          Preview Email
        </button>
      </DialogTrigger>
      <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[630px] overflow-hidden p-0">
        <IFrame innerHTML={html} className="h-full w-full p-6" />
      </DialogContent>
    </Dialog>
  );
}
