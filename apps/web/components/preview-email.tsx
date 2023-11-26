'use client';

import { useFormStatus } from 'react-dom';
import { Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { previewEmailAction } from '@/actions/email';
import { useEditorStrore } from '@/stores/use-editor';
import { useServerAction } from '@/utils/use-server-action';
import { EmailFrame } from './email-frame';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface SubmitButtonProps {
  disabled?: boolean;
}

function SubmitButton(props: SubmitButtonProps) {
  const { disabled } = props;
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-black px-2 py-1 text-sm text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <Loader2 className="inline-block mr-1 animate-spin" size={16} />
      ) : (
        <Eye className="inline-block mr-1" size={16} />
      )}
      Preview Email
    </button>
  );
}

export function PreviewEmail() {
  const { json, previewText } = useEditorStrore();

  const [html, setHtml] = useState<string>('');
  const [action, isPending] = useServerAction(previewEmailAction, (result) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Result is always there
    const { data, error } = result!;
    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }
    setHtml(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={action}>
          <input name="json" type="hidden" value={JSON.stringify(json) || ''} />
          <input name="previewText" type="hidden" value={previewText} />
          <SubmitButton disabled={!json} />
        </form>
      </DialogTrigger>
      {!isPending ? (
        <DialogContent className="min-h-[75vh] w-full min-w-0 max-w-[680px] overflow-hidden p-0 max-[680px]:h-full max-[680px]:rounded-none max-[680px]:shadow-none max-[680px]:border-0 animation-none">
          <EmailFrame className="h-full w-full" innerHTML={html} />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
