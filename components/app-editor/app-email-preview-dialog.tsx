'use client';

import { useState } from 'react';
import { Editor } from '@tiptap/core';
import { EyeIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { tiptapToHtml } from '../editor/utils/email';
import { IFrame } from '../iframe';
import { Button } from '../ui/button';

type EmailPreviewDialogProps = {
  editor: Editor;
};

export function AppEmailPreviewDialog(props: EmailPreviewDialogProps) {
  const [html, setHtml] = useState('');
  const { editor } = props;
  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => {
          setHtml(tiptapToHtml(editor?.getJSON().content || []));
        }}
      >
        <Button>
          <EyeIcon className="mr-2 h-4 w-4" />
          Preview Email
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0">
        <IFrame innerHTML={html} className="h-full w-full" />
      </DialogContent>
    </Dialog>
  );
}
