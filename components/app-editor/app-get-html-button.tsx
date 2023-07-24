'use client';

import copy from 'copy-to-clipboard';
import { CopyIcon } from 'lucide-react';

import { tiptapToHtml } from '../editor/utils/email';
import { Editor } from '@tiptap/core';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';

type Props = {
  editor: Editor
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
      <CopyIcon className="w-4 h-4 mr-2" />
      Copy Email HTML
    </Button>
  );
}
