'use client';

import { Editor } from '@tiptap/core';
import copy from 'copy-to-clipboard';
import { CopyIcon } from 'lucide-react';

import { tiptapToHtml } from '../editor/utils/email';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

type Props = {
  editor: Editor;
};
export function AppGetHtmlButton(props: Props) {
  const { editor } = props;
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() => {
        const html = tiptapToHtml(editor?.getJSON().content || []);
        copy(html);
        toast({
          title: 'Copied to clipboard',
          description: 'The HTML code has been copied!',
        });
      }}
    >
      <CopyIcon className="mr-2 h-4 w-4" />
      Copy Email HTML
    </Button>
  );
}
