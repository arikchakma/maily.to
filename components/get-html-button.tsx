'use client';

import copy from 'copy-to-clipboard';

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
    <BaseButton
      variant="outline"
      className="grow"
      onClick={() => {
        const html = tiptapToHtml(editor.getEditor()?.getJSON().content || []);
        copy(html);
        toast({
          title: 'Copied to clipboard',
          description: 'The HTML code has been copied!',
        });
      }}
    >
      Copy
    </BaseButton>
  );
}
