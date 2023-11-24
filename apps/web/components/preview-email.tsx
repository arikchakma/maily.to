import { renderAsync } from '@maily-to/render';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { EmailFrame } from './email-frame';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface PreviewEmailProps {
  editor?: TiptapEditor;
  previewText: string;
}

export function PreviewEmail(props: PreviewEmailProps) {
  const { editor, previewText } = props;

  const [emailHtml, setEmailHtml] = useState<string>('');

  const handleClick = async () => {
    const content = editor?.getJSON();
    if (!content) {
      return;
    }

    const html = await renderAsync(content, {
      preview: previewText,
    });

    setEmailHtml(html);
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={handleClick}>
        <button
          className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center"
          disabled={!editor}
          type="button"
        >
          <Eye className="inline-block mr-1" size={16} />
          Preview Email
        </button>
      </DialogTrigger>
      <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:shadow-none max-[680px]:border-0">
        <EmailFrame className="h-full w-full" innerHTML={emailHtml} />
      </DialogContent>
    </Dialog>
  );
}
