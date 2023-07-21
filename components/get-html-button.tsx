'use client';

import copy from 'copy-to-clipboard';
import { CopyIcon } from 'lucide-react';

import { MailEditor } from './editor';
import { BaseButton } from './editor/components/base-button';
import { useToast } from './editor/hooks/use-toast';
import { tiptapToHtml } from './editor/utils/email';

type Props = {
  editor: MailEditor;
};
export function GetHtmlButton(props: Props) {
  const { editor } = props;
  const { toast } = useToast();
  return (
    <button
      className="flex min-h-[56px] grow items-center justify-center gap-3 rounded-md bg-black px-4 py-3 text-xl font-medium text-white transition-all hover:bg-red-500 focus:outline-0"
      onClick={() => {
        const html = tiptapToHtml(editor.getEditor()?.getJSON().content || []);
        copy(html);
        toast({
          title: 'Copied to clipboard',
          description: 'The HTML code has been copied!',
        });
      }}
    >
      <CopyIcon size={24} />
      Copy Email HTML
    </button>
  );
}
