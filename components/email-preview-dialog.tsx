'use client';

import { useState } from 'react';
import { JSONContent } from '@tiptap/core';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { MailEditor } from './editor';
import { BaseButton } from './editor/components/base-button';
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
        <BaseButton variant="outline" className="grow">
          Preview Email
        </BaseButton>
      </DialogTrigger>
      <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[600px] overflow-hidden p-0">
        <IFrame innerHTML={html} className="h-full w-full" />
      </DialogContent>
    </Dialog>
  );
}
